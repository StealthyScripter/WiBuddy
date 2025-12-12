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

class StudyField(enum.Enum):
    TECHNOLOGY = "TECHNOLOGY"
    NURSING = "NURSING"
    BUSINESS = "BUSINESS"
    ENGINEERING = "ENGINEERING"
    SCIENCE = "SCIENCE"
    ARTS = "ARTS"
    OTHER = "OTHER"

class ContentType(enum.Enum):
    NOTE = "NOTE"
    PDF = "PDF"
    PPT = "PPT"
    IMAGE = "IMAGE"
    AUDIO = "AUDIO"
    VIDEO = "VIDEO"
    LINK = "LINK"

class DocumentStatus(enum.Enum):
    PENDING = "PENDING"
    PROCESSING = "PROCESSING"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"

class QuestionType(enum.Enum):
    MULTIPLE_CHOICE = "MULTIPLE_CHOICE"
    TRUE_FALSE = "TRUE_FALSE"
    SHORT_ANSWER = "SHORT_ANSWER"
    ESSAY = "ESSAY"

class AssessmentType(enum.Enum):
    QUIZ = "QUIZ"
    EXAM = "EXAM"
    ASSIGNMENT = "ASSIGNMENT"
    PROJECT = "PROJECT"
    PRACTICE = "PRACTICE"

class PerformanceLevel(enum.Enum):
    EXCELLENT = "EXCELLENT"
    GOOD = "GOOD"
    AVERAGE = "AVERAGE"
    NEEDS_IMPROVEMENT = "NEEDS_IMPROVEMENT"
    POOR = "POOR"


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

    # Method to get attachments for this task
    def get_attachments(self):
        return Attachment.query.filter_by(entity_type='task', entity_id=self.id).all()

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

    # Method to get attachments for this project
    def get_attachments(self):
        return Attachment.query.filter_by(entity_type='project', entity_id=self.id).all()


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


class Folder(db.Model):
    __tablename__ = 'folders'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    parent_id = db.Column(db.Integer, db.ForeignKey('folders.id'), nullable=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    date_created = db.Column(db.DateTime, default=datetime.utcnow)
    last_modified = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    color = db.Column(db.String(50))

    # Self-referential relationship for nested folders
    children = db.relationship('Folder', backref=db.backref('parent', remote_side=[id]), lazy='dynamic')

    # Relationship to notes
    notes = db.relationship('Note', backref='folder', lazy='dynamic')

class Course(db.Model):
    __tablename__ = 'courses'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    code = db.Column(db.String(50))
    description = db.Column(db.Text)
    field = db.Column(db.Enum(StudyField), default=StudyField.OTHER)
    instructor = db.Column(db.String(100))
    semester = db.Column(db.String(50))
    credits = db.Column(db.Integer)
    start_date = db.Column(db.DateTime)
    end_date = db.Column(db.DateTime)
    progress = db.Column(db.Float, default=0.0)  # 0-100
    color = db.Column(db.String(50))
    tags = db.Column(db.JSON)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    date_created = db.Column(db.DateTime, default=datetime.utcnow)
    last_modified = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    modules = db.relationship('Module', backref='course', lazy='dynamic', cascade='all, delete-orphan')

    def calculate_progress(self):
        """Calculate course progress based on completed modules"""
        total_modules = self.modules.count()
        if total_modules == 0:
            return 0.0
        completed_modules = sum(1 for module in self.modules if module.progress >= 100)
        return (completed_modules / total_modules) * 100

class Module(db.Model):
    __tablename__ = 'modules'
    id = db.Column(db.Integer, primary_key=True)
    course_id = db.Column(db.Integer, db.ForeignKey('courses.id', ondelete='CASCADE'), nullable=False)
    name = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    order = db.Column(db.Integer, default=0)
    learning_objectives = db.Column(db.JSON)  # Array of strings
    progress = db.Column(db.Float, default=0.0)  # 0-100
    estimated_hours = db.Column(db.Integer)
    completed_hours = db.Column(db.Integer, default=0)
    due_date = db.Column(db.DateTime)
    date_created = db.Column(db.DateTime, default=datetime.utcnow)
    last_modified = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    notes = db.relationship('Note', backref='module', lazy='dynamic')

    def calculate_progress(self):
        """Calculate module progress based on completed notes/content"""
        total_notes = self.notes.count()
        if total_notes == 0:
            return 0.0
        # Could implement more sophisticated logic here
        return self.progress

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
    ai_summary = db.Column(db.Text)

    # Relationships
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    folder_id = db.Column(db.Integer, db.ForeignKey('folders.id'), nullable=True)
    module_id = db.Column(db.Integer, db.ForeignKey('modules.id'), nullable=True)

    # Method to get attachments for this note
    def get_attachments(self):
        return Attachment.query.filter_by(entity_type='note', entity_id=self.id).all()


class Comment(db.Model):
    __tablename__ = 'comments'
    id = db.Column(db.Integer, primary_key=True)
    author = db.Column(db.String(100), nullable=False)
    content = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    # Foreign keys
    task_id = db.Column(db.Integer, db.ForeignKey('tasks.id'), nullable=True)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'), nullable=True)

    # User who authored the comment
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)

    # Method to get attachments for this comment
    def get_attachments(self):
        return Attachment.query.filter_by(entity_type='comment', entity_id=self.id).all()


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

# Document Management Models
class Document(db.Model):
    __tablename__ = 'documents'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    original_name = db.Column(db.String(200))
    type = db.Column(db.Enum(ContentType), nullable=False)
    file_url = db.Column(db.String(500), nullable=False)
    thumbnail_url = db.Column(db.String(500))
    file_size = db.Column(db.Integer)  # in bytes
    mime_type = db.Column(db.String(100))
    page_count = db.Column(db.Integer)
    status = db.Column(db.Enum(DocumentStatus), default=DocumentStatus.PENDING)
    processed_pdf_url = db.Column(db.String(500))  # For converted PPT
    extracted_text = db.Column(db.Text)
    ocr_text = db.Column(db.Text)
    tags = db.Column(db.JSON)
    uploaded_by = db.Column(db.Integer, db.ForeignKey('users.id'))
    module_id = db.Column(db.Integer, db.ForeignKey('modules.id'), nullable=True)
    is_shared = db.Column(db.Boolean, default=False)
    date_created = db.Column(db.DateTime, default=datetime.utcnow)
    last_modified = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

# AI Learning Materials
class Flashcard(db.Model):
    __tablename__ = 'flashcards'
    id = db.Column(db.Integer, primary_key=True)
    module_id = db.Column(db.Integer, db.ForeignKey('modules.id'), nullable=True)
    note_id = db.Column(db.Integer, db.ForeignKey('notes.id'), nullable=True)
    front = db.Column(db.Text, nullable=False)
    back = db.Column(db.Text, nullable=False)
    difficulty = db.Column(db.Enum(Priority), default=Priority.MEDIUM)
    tags = db.Column(db.JSON)
    review_count = db.Column(db.Integer, default=0)
    last_reviewed_date = db.Column(db.DateTime)
    next_review_date = db.Column(db.DateTime)
    confidence_level = db.Column(db.Float, default=0.0)  # 0-100
    is_starred = db.Column(db.Boolean, default=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    date_created = db.Column(db.DateTime, default=datetime.utcnow)

class Question(db.Model):
    __tablename__ = 'questions'
    id = db.Column(db.Integer, primary_key=True)
    module_id = db.Column(db.Integer, db.ForeignKey('modules.id'), nullable=True)
    note_id = db.Column(db.Integer, db.ForeignKey('notes.id'), nullable=True)
    question = db.Column(db.Text, nullable=False)
    type = db.Column(db.Enum(QuestionType), nullable=False)
    options = db.Column(db.JSON)  # Array of options for multiple choice
    correct_answer = db.Column(db.Text)
    explanation = db.Column(db.Text)
    difficulty = db.Column(db.Enum(Priority), default=Priority.MEDIUM)
    tags = db.Column(db.JSON)
    related_concepts = db.Column(db.JSON)
    points = db.Column(db.Integer, default=1)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    date_created = db.Column(db.DateTime, default=datetime.utcnow)

class CheatSheet(db.Model):
    __tablename__ = 'cheatsheets'
    id = db.Column(db.Integer, primary_key=True)
    module_id = db.Column(db.Integer, db.ForeignKey('modules.id'), nullable=True)
    course_id = db.Column(db.Integer, db.ForeignKey('courses.id'), nullable=True)
    title = db.Column(db.String(200), nullable=False)
    content = db.Column(db.JSON)  # Structured content with sections
    tags = db.Column(db.JSON)
    is_starred = db.Column(db.Boolean, default=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    date_created = db.Column(db.DateTime, default=datetime.utcnow)
    last_modified = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

# Performance Tracking
class StudySession(db.Model):
    __tablename__ = 'study_sessions'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    module_id = db.Column(db.Integer, db.ForeignKey('modules.id'), nullable=True)
    course_id = db.Column(db.Integer, db.ForeignKey('courses.id'), nullable=True)
    start_time = db.Column(db.DateTime, nullable=False)
    end_time = db.Column(db.DateTime)
    duration = db.Column(db.Integer)  # in minutes
    activities_completed = db.Column(db.JSON)  # Array of activity descriptions
    flashcards_reviewed = db.Column(db.Integer, default=0)
    questions_answered = db.Column(db.Integer, default=0)
    correct_answers = db.Column(db.Integer, default=0)
    notes_taken = db.Column(db.Text)
    focus_score = db.Column(db.Float)  # 0-100
    date_created = db.Column(db.DateTime, default=datetime.utcnow)

class Assessment(db.Model):
    __tablename__ = 'assessments'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    module_id = db.Column(db.Integer, db.ForeignKey('modules.id'), nullable=False)
    course_id = db.Column(db.Integer, db.ForeignKey('courses.id'), nullable=False)
    name = db.Column(db.String(200), nullable=False)
    type = db.Column(db.Enum(AssessmentType), nullable=False)
    total_points = db.Column(db.Integer, nullable=False)
    score = db.Column(db.Float)  # Points earned
    passing_score = db.Column(db.Float)
    due_date = db.Column(db.DateTime)
    submission_date = db.Column(db.DateTime)
    feedback = db.Column(db.Text)
    is_graded = db.Column(db.Boolean, default=False)
    time_limit = db.Column(db.Integer)  # in minutes
    questions_data = db.Column(db.JSON)  # Store question IDs and answers
    date_created = db.Column(db.DateTime, default=datetime.utcnow)

class WeakPoint(db.Model):
    __tablename__ = 'weak_points'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    concept = db.Column(db.String(200), nullable=False)
    module_id = db.Column(db.Integer, db.ForeignKey('modules.id'), nullable=True)
    course_id = db.Column(db.Integer, db.ForeignKey('courses.id'), nullable=True)
    score = db.Column(db.Float, nullable=False)  # 0-100
    occurrences = db.Column(db.Integer, default=1)
    related_questions = db.Column(db.JSON)  # Array of question IDs
    suggested_resources = db.Column(db.JSON)  # Array of resource recommendations
    is_addressed = db.Column(db.Boolean, default=False)
    last_identified = db.Column(db.DateTime, default=datetime.utcnow)
    date_created = db.Column(db.DateTime, default=datetime.utcnow)

# Trends and Market Insights
class FieldTrend(db.Model):
    __tablename__ = 'field_trends'
    id = db.Column(db.Integer, primary_key=True)
    field = db.Column(db.Enum(StudyField), nullable=False)
    trend_type = db.Column(db.String(50))  # HOT_SKILL, LATEST_RELEASE, RESEARCH, etc.
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    source = db.Column(db.String(100))
    source_url = db.Column(db.String(500))
    relevance_score = db.Column(db.Float, default=0.0)  # 0-100
    published_date = db.Column(db.DateTime)
    expiry_date = db.Column(db.DateTime)
    tags = db.Column(db.JSON)
    is_starred = db.Column(db.Boolean, default=False)
    related_skills = db.Column(db.JSON)
    difficulty = db.Column(db.Enum(Priority))
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    date_created = db.Column(db.DateTime, default=datetime.utcnow)

