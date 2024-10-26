import unittest
from app import app, db
from app.models import Task

class TaskModelTestCase(unittest.TestCase):
    def setUp(self):
        self.app = app
        self.app.config['TESTING'] = True
        self.app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
        self.client = self.app.test_client()
        with self.app.app_context():
            db.create_all()

    def tearDown(self):
        with self.app.app_context():
            db.session.remove()
            db.drop_all()

    def test_task_creation(self):
        task = Task(content="Test Task", completed=False)
        with self.app.app_context():
            db.session.add(task)
            db.session.commit()
            self.assertEqual(Task.query.count(), 1)

if __name__ == '__main__':
    unittest.main()
