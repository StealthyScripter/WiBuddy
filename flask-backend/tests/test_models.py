import unittest
from app import db, app
from app.models import Task, Project, Technology, Affirmation

class TestModels(unittest.TestCase):

    def setUp(self):
        app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
        app.config['TESTING'] = True
        self.app = app
        with app.app_context():
            db.create_all()

    def tearDown(self):
        with app.app_context():
            db.session.remove()
            db.drop_all()

    def test_task_creation(self):
        with app.app_context():
            task = Task(name="Test Task", is_completed=False)
            db.session.add(task)
            db.session.commit()
            self.assertIsNotNone(task.id)

    def test_project_creation(self):
        with app.app_context():
            project = Project(name="Test Project")
            db.session.add(project)
            db.session.commit()
            self.assertIsNotNone(project.id)

    def test_technology_creation(self):
        with app.app_context():
            tech = Technology(name="Test Technology")
            db.session.add(tech)
            db.session.commit()
            self.assertIsNotNone(tech.id)

if __name__ == '__main__':
    unittest.main()
