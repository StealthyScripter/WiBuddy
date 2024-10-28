from app import db

project_technologies = db.Table('project_technologies',
    db.Column('project_id', db.Integer, db.ForeignKey('projects.id'), primary_key=True),
    db.Column('technology_id', db.Integer, db.ForeignKey('technologies.id'), primary_key=True)
)

class Task(db.Model):
    __tablename__ = 'tasks'
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.String(200), nullable=False)
    completed = db.Column(db.Boolean, default=False)
    date = db.Column(db.String,default='10-23-2024')

class Project(db.Model):
    __tablename__ = 'projects'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    technologies = db.relationship('Technology', secondary='project_technologies', back_populates='projects')
    milestones = db.relationship('Milestone', back_populates='project')

class Technology(db.Model):
    __tablename__ = 'technologies'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    projects = db.relationship('Project', secondary='project_technologies', back_populates='technologies')

class Milestone(db.Model):
    __tablename__ = 'milestones'
    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.String(200), nullable=False)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'))
    project = db.relationship('Project', back_populates='milestones')

class Affirmation(db.Model):
    __tablename__ = 'affirmations'
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.String(500), nullable=False)

class Progress(db.Model):
    __tablename__ = 'progress'
    id = db.Column(db.Integer, primary_key=True)
    language = db.Column(db.String(50), nullable=False)
    completed = db.Column(db.Integer, nullable=False)
    total = db.Column(db.Integer, nullable=False)
    date_started = db.Column(db.String)
