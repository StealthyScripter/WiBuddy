from werkzeug.security import generate_password_hash, check_password_hash
from app import db
from datetime import datetime
from sqlalchemy import func
import enum

class TaskStatus(enum.Enum):
    NOT_STARTED = "NOT_STARTED"
    IN_PROGRESS = "IN_PROGRESS"
    COMPLETED = "COMPLETED"
    OVERDUE = "OVERDUE"
    CANCELLED = "CANCELLED"

class Priority(enum.Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"

class TaskCategory(enum.Enum):
    DEVELOPMENT = "DEVELOPMENT"
    DESIGN = "DESIGN"
    TESTING = "TESTING"
    DOCUMENTATION = "DOCUMENTATION"
    DEPLOYMENT = "DEPLOYMENT"

class EventType(enum.Enum):
    MEETING = "meeting"
    DEADLINE = "deadline"
    TASK = "task"


# Many-to-Many table for task prerequisites
task_prerequisites = db.Table('task_prerequisites',
    db.Column('task_id', db.Integer, db.ForeignKey('tasks.id'), primary_key=True),
    db.Column('prerequisite_id', db.Integer, db.ForeignKey('tasks.id'), primary_key=True)
)

# Many-to-Many table for task technologies
task_technologies = db.Table('task_technologies',
    db.Column('task_id', db.Integer, db.ForeignKey('tasks.id'), primary_key=True),
    db.Column('technology_id', db.Integer, db.ForeignKey('technologies.id'), primary_key=True)
)

# Many-to-Many table for project team members
project_team_members = db.Table('project_team_members',
    db.Column('project_id', db.Integer, db.ForeignKey('projects.id'), primary_key=True),
    db.Column('user_id', db.Integer, db.ForeignKey('users.id'), primary_key=True)
)

class Task(db.Model):
    __tablename__ = 'tasks'
    __table_args__ = (
    db.Index('idx_task_project', 'project_id'),
    db.Index('idx_task_assignee', 'assignee_id'),
    db.Index('idx_task_status', 'status'),
    )

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    description = db.Column(db.String)
    is_completed = db.Column(db.Boolean, default=False)
    date_created = db.Column(db.DateTime, default=datetime.utcnow)
    hierarchy = db.Column(db.Integer, default=1)  # Lower values indicate higher priority
    due_date = db.Column(db.DateTime)
    estimated_duration = db.Column(db.Integer, default=4)  # duration in hours, days, etc.
    completion_date = db.Column(db.DateTime)
    is_milestone = db.Column(db.Boolean, default=False)
    status = db.Column(db.Enum(TaskStatus), default=TaskStatus.NOT_STARTED)
    priority = db.Column(db.Enum(Priority), default=Priority.MEDIUM)
    category = db.Column(db.Enum(TaskCategory), nullable=True)
    assignee_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    last_modified = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    tags = db.Column(db.JSON)


    # Foreign keys with project and technology references
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id', ondelete='CASCADE'), nullable=True)
    attachments = db.relationship('Attachment', backref='task', lazy=True)
    comments = db.relationship('Comment', backref='task', lazy=True)

    # Relationship for prerequisites
    prerequisites = db.relationship(
        'Task',
        secondary=task_prerequisites,
        primaryjoin=(task_prerequisites.c.task_id == id),
        secondaryjoin=(task_prerequisites.c.prerequisite_id == id),
        backref=db.backref('dependent_tasks', lazy='dynamic'),
        lazy='dynamic'
    )

    def add_prerequisite(self, task, max_depth=5):
      """Add a prerequisite task with cycle detection"""
      # Check if this would create a cycle
      if self in task.get_prerequisites(max_depth):
        raise ValueError("Adding this prerequisite would create a cycle")
        self.prerequisites.append(task)

    def get_prerequisites(self, max_depth=5, current_depth=0):
        """Get all prerequisites up to max_depth"""
        if current_depth >= max_depth:
            return []
        result = list(self.prerequisites)
        for prereq in self.prerequisites:
            result.extend(prereq.get_prerequisites(max_depth, current_depth + 1))
        return result

    # Update Task model's technology relationship
    technologies = db.relationship(
        'Technology',
        secondary=task_technologies,
        backref=db.backref('tasks_using', lazy='dynamic'),
        lazy='dynamic'
    )

class Project(db.Model):
    __tablename__ = 'projects'
    __table_args__ = (
    db.CheckConstraint('due_date > date_created', name='check_project_dates'),
    )

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    description = db.Column(db.String)
    date_created = db.Column(db.DateTime, default=datetime.utcnow)
    due_date = db.Column(db.DateTime)
    completion_date = db.Column(db.DateTime)
    is_completed=db.Column(db.Boolean,default=False)
    owner_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    status = db.Column(db.Enum(TaskStatus), default=TaskStatus.NOT_STARTED)
    priority = db.Column(db.Enum(Priority), default=Priority.MEDIUM)
    department = db.Column(db.String(100))

    #Secondary tables and methods
    tasks = db.relationship('Task', backref='project', lazy=True)
    team_members = db.relationship('User', secondary='project_team_members', backref='projects')
    comments = db.relationship('Comment', backref='project', lazy=True)

    # Convenience methods
    def project_milestones(self):
        return [task for task in self.tasks if task.is_milestone]

    def project_progress(self):
        completed_tasks = sum(1 for task in self.tasks if task.is_completed)
        total_tasks = len(self.tasks)
        return (completed_tasks / total_tasks * 100) if total_tasks > 0 else 0

    def technologies_used(self):
        return list(set(task.technology for task in self.tasks if task.technology))


class Progress(db.Model):
    __tablename__ = 'progress'
    id = db.Column(db.Integer, primary_key=True)
    entity_type = db.Column(db.String(50), nullable=False)
    entity_id = db.Column(db.Integer, nullable=False)
    progress_value = db.Column(db.Float, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    @staticmethod
    def calculate_progress(entity_type, entity_id):
        if entity_type == 'project':
            project = Project.query.get(entity_id)
            return project.progress() if project else None
        elif entity_type == 'technology':
            technology = Technology.query.get(entity_id)
            tasks = technology.tasks
            completed_tasks = sum(1 for task in tasks if task.is_completed)
            total_tasks = len(tasks)
            return (completed_tasks / total_tasks * 100) if total_tasks > 0 else 0

class Technology(db.Model):
    __tablename__ = 'technologies'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False, unique=True)
    description = db.Column(db.String)
    version = db.Column(db.String(50))
    category = db.Column(db.String(50))
    documentation_url = db.Column(db.String(500))
    proficiency = db.Column(db.Integer)
    count = db.Column(db.Integer)
    icon = db.Column(db.String(200))

class Affirmation(db.Model):
    __tablename__ = 'affirmations'
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.String(500))  # Rename from 'affirmation'
    daily_goals = db.Column(db.JSON)  # Change from String to JSON array
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    tags = db.Column(db.JSON)
    reminder_time = db.Column(db.DateTime)
    is_active = db.Column(db.Boolean, default=True)


class Graph(db.Model):  # Renaming to singular "Graph" for clarity
    __tablename__ = 'graphs'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    type = db.Column(db.Enum('BAR', 'LINE', 'PIE', 'GANTT', name='graph_type'), nullable=False)
    entity_type = db.Column(db.Enum('TASK', 'PROJECT', 'PROGRESS', name='graph_entity_type'))
    entity_id = db.Column(db.Integer)
    config = db.Column(db.JSON)
    refresh_interval = db.Column(db.Integer)

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    is_admin = db.Column(db.Boolean, default=False)
    date_joined = db.Column(db.DateTime, default=datetime.utcnow)

    # Tasks created by this user (if you want to add ownership)
    # tasks = db.relationship('Task', backref='creator', lazy=True)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    @property
    def is_authenticated(self):
        return True

    @property
    def is_active(self):
        return True

    @property
    def is_anonymous(self):
        return False

    def get_id(self):
        return str(self.id)

class Attachment(db.Model):
    __tablename__ = 'attachments'
    id = db.Column(db.Integer, primary_key=True)
    type = db.Column(db.Enum('image', 'document', 'link', 'github', name='attachment_type'), nullable=False)
    name = db.Column(db.String(200))
    url = db.Column(db.String(500))
    thumbnail = db.Column(db.String(500))
    entity_type = db.Column(db.String(50), nullable=False)
    entity_id = db.Column(db.Integer, nullable=False)

    __table_args__ = (db.Index('idx_attachment_entity', 'entity_type', 'entity_id'),)


class Note(db.Model):
    __tablename__ = 'notes'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    content = db.Column(db.JSON)  # Store content as a JSON array of strings
    date_created = db.Column(db.DateTime, default=datetime.utcnow)
    last_modified = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    type = db.Column(db.Enum('text', 'list', 'media', name='note_type'), default='text')
    image_url = db.Column(db.String(500))  # Preview thumbnail
    images = db.Column(db.JSON)  # Store as JSON array of {url, alt} objects
    tags = db.Column(db.JSON)  # Store as JSON array of strings
    items = db.Column(db.JSON)  # For list-type notes, store as JSON array
    ai_summary = db.Column(db.String)

    # Relationships
    attachments = db.relationship('Attachment', backref='note', lazy=True)

    # User relationship (optional)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)


class Comment(db.Model):
    __tablename__ = 'comments'
    id = db.Column(db.Integer, primary_key=True)
    author = db.Column(db.String(100), nullable=False)
    content = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    # Foreign keys
    task_id = db.Column(db.Integer, db.ForeignKey('tasks.id'), nullable=True)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'), nullable=True)

    # Relationships
    attachments = db.relationship('Attachment', backref='comment', lazy=True)

    # User who authored the comment
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)


class CalendarEvent(db.Model):
    __tablename__ = 'calendar_events'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    date = db.Column(db.DateTime, nullable=False)
    end_date = db.Column(db.DateTime)
    type = db.Column(db.Enum(EventType), nullable=False)
    color = db.Column(db.String(50))
    description = db.Column(db.Text)

    # Foreign keys
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'), nullable=True)
    task_id = db.Column(db.Integer, db.ForeignKey('tasks.id'), nullable=True)

    # User who owns the event
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))

    __table_args__ = (
    db.Index('idx_calendar_project', 'project_id'),
    db.Index('idx_calendar_task', 'task_id'),
    db.Index('idx_calendar_user', 'user_id'),
    )

