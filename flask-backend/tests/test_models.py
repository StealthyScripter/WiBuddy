# tests/test_models.py
import unittest
from app import db, app
from app.models import Task  # Update this to the correct import path for your Task model

class TaskModelTestCase(unittest.TestCase):

    def setUp(self):
        app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'  # Use an in-memory SQLite database for testing
        app.config['TESTING'] = True
        self.app = app
        self.client = app.test_client()
        with app.app_context():
            db.create_all()  # Create the database and tables

    def tearDown(self):
        with app.app_context():
            db.session.remove()
            db.drop_all()

    def test_task_creation(self):
        with app.app_context():
            # Ensure the correct keyword argument is used
            task = Task(name="Test Task", is_completed=False)
            db.session.add(task)
            db.session.commit()
            self.assertIsNotNone(task.id)  # Ensure the task has been assigned an ID

if __name__ == '__main__':
    unittest.main()
