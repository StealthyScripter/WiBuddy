import unittest
from unittest.mock import patch
from app import app, db
from app.models import Task, Project
from datetime import datetime

class TestRoutes(unittest.TestCase):

    def setUp(self):
        app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
        app.config['TESTING'] = True
        self.client = app.test_client()
        with app.app_context():
            db.create_all()

    def tearDown(self):
        with app.app_context():
            db.session.remove()
            db.drop_all()

    @patch('app.services.task_service.TaskService.get_all_tasks')
    def test_home_route(self, mock_get_all_tasks):
        mock_get_all_tasks.return_value = [
            Task(name="Test Task", is_completed=False, date_created=datetime.utcnow())
        ]
        response = self.client.get('/')
        self.assertEqual(response.status_code, 200)
        self.assertIn(b"Test Task", response.data)

    def test_add_task(self):
        response = self.client.post('/add_task/', data={
            'name': 'Test Task',
            'description': 'Test Description',
            'due_date': '2024-11-30'
        }, follow_redirects=True)
        self.assertEqual(response.status_code, 200)

if __name__ == '__main__':
    unittest.main()
