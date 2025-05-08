from werkzeug.security import generate_password_hash, check_password_hash
from app import db
from datetime import datetime
from sqlalchemy import func

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
    status = db.Column(db.String(50), default='NOT_STARTED')
    priority = db.Column(db.String(50), default='MEDIUM')
    category = db.Column(db.String(50))
    assignee_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    tags = db.Column(db.String)


    # Foreign keys with project and technology references
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'), nullable=True)
    technology_id = db.Column(db.Integer, db.ForeignKey('technologies.id'), nullable=True)
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

    # Update Task model's technology relationship
    technologies = db.relationship(
        'Technology',
        secondary=task_technologies,
        backref=db.backref('tasks_using', lazy='dynamic'),
        lazy='dynamic'
    )

class Project(db.Model):
    __tablename__ = 'projects'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    description = db.Column(db.String)
    date_created = db.Column(db.DateTime, default=datetime.utcnow)
    due_date = db.Column(db.DateTime)
    completion_date = db.Column(db.DateTime)
    is_completed=db.Column(db.Boolean,default=False)
    owner_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    status = db.Column(db.String(50), default='NOT_STARTED')
    priority = db.Column(db.String(50), default='MEDIUM')
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
    name = db.Column(db.String(50), nullable=False)
    description = db.Column(db.String)

    #relationship
    tasks = db.relationship('Task', backref='technology', lazy=True)

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
    title = db.Column(db.String, nullable=False)
    type = db.Column(db.String(50), nullable=False)  # Replace Enum with String for simplicity
    data_source = db.Column(db.Integer)
    entity_type = db.Column(db.String(50))
    entity_id = db.Column(db.Integer)
    config = db.Column(db.JSON)  # Store configuration as JSON
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
    type = db.Column(db.String(50), nullable=False)  # 'image', 'document', 'link', 'github'
    name = db.Column(db.String(200))
    url = db.Column(db.String(500))
    thumbnail = db.Column(db.String(500))

    # Relationships
    task_id = db.Column(db.Integer, db.ForeignKey('tasks.id'), nullable=True)
    note_id = db.Column(db.Integer, db.ForeignKey('notes.id'), nullable=True)
    comment_id = db.Column(db.Integer, db.ForeignKey('comments.id'), nullable=True)


class Note(db.Model):
    __tablename__ = 'notes'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    content = db.Column(db.JSON)  # Store content as a JSON array of strings
    date_created = db.Column(db.DateTime, default=datetime.utcnow)
    last_modified = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    type = db.Column(db.String(50), default='text')  # 'text', 'list', 'media'
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
    type = db.Column(db.String(50), nullable=False)  # 'meeting', 'deadline', 'task'
    color = db.Column(db.String(50))
    description = db.Column(db.Text)

    # Foreign keys
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'), nullable=True)
    task_id = db.Column(db.Integer, db.ForeignKey('tasks.id'), nullable=True)

    # User who owns the event
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
