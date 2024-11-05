from app import db
from datetime import datetime
from sqlalchemy import func

# Many-to-Many table for task prerequisites
task_prerequisites = db.Table('task_prerequisites',
    db.Column('task_id', db.Integer, db.ForeignKey('tasks.id'), primary_key=True),
    db.Column('prerequisite_id', db.Integer, db.ForeignKey('tasks.id'), primary_key=True)
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
    
    # Foreign keys with project and technology references
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'), nullable=True)
    technology_id = db.Column(db.Integer, db.ForeignKey('technologies.id'), nullable=True)

    # Relationship for prerequisites
    prerequisites = db.relationship(
        'Task',
        secondary=task_prerequisites,
        primaryjoin=(task_prerequisites.c.task_id == id),
        secondaryjoin=(task_prerequisites.c.prerequisite_id == id),
        backref=db.backref('dependent_tasks', lazy='dynamic'),
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



class Technology(db.Model):
    __tablename__ = 'technologies'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    description = db.Column(db.String)

class Affirmation(db.Model):
    __tablename__ = 'affirmations'
    id = db.Column(db.Integer, primary_key=True)
    affirmation = db.Column(db.String(500))
    daily_goals = db.Column(db.String(500))

    @staticmethod
    def get_affirmations():
        return Affirmation.query.all()

class Graph(db.Model):  # Renaming to singular "Graph" for clarity
    __tablename__ = 'graphs'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String, nullable=False)
    type = db.Column(db.String(50), nullable=False)  # Replace Enum with String for simplicity
    data_source = db.Column(db.Integer)
