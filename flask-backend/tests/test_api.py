# tests/test_api.py
import unittest
import json
from datetime import datetime, timedelta
from app import app, db
from app.models import Task, Project, Technology

class TaskAPITestCase(unittest.TestCase):
    def setUp(self):
        app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
        app.config['TESTING'] = True
        self.client = app.test_client()

        with app.app_context():
            db.create_all()

            # Create test data
            project = Project(name="Test Project", description="Test Project Description")
            technology = Technology(name="Test Technology", description="Test Technology Description")

            db.session.add(project)
            db.session.add(technology)
            db.session.commit()

            # Create a test task
            task = Task(
                name="Test Task",
                description="Test Description",
                is_completed=False,
                date_created=datetime.utcnow(),
                due_date=datetime.utcnow() + timedelta(days=7),
                estimated_duration=8,
                project_id=project.id,
                technology_id=technology.id,
                is_milestone=False
            )

            db.session.add(task)
            db.session.commit()

            self.task_id = task.id
            self.project_id = project.id
            self.technology_id = technology.id

    def tearDown(self):
        with app.app_context():
            db.session.remove()
            db.drop_all()

    def test_get_all_tasks(self):
        """Test getting all tasks"""
        response = self.client.get('/api/tasks')
        self.assertEqual(response.status_code, 200)

        data = json.loads(response.data)
        self.assertIsInstance(data, list)
        self.assertEqual(len(data), 1)
        self.assertEqual(data[0]['name'], "Test Task")

    def test_get_task(self):
        """Test getting a specific task"""
        response = self.client.get(f'/api/tasks/{self.task_id}')
        self.assertEqual(response.status_code, 200)

        data = json.loads(response.data)
        self.assertEqual(data['name'], "Test Task")
        self.assertEqual(data['description'], "Test Description")

    def test_create_task(self):
        """Test creating a new task"""
        task_data = {
            'name': 'New Task',
            'description': 'New Description',
            'due_date': (datetime.utcnow() + timedelta(days=10)).strftime('%Y-%m-%d'),
            'estimated_duration': 5,
            'project_id': self.project_id,
            'technology_id': self.technology_id,
            'is_milestone': True
        }

        response = self.client.post(
            '/api/tasks',
            data=json.dumps(task_data),
            content_type='application/json'
        )

        self.assertEqual(response.status_code, 201)

        data = json.loads(response.data)
        self.assertEqual(data['name'], 'New Task')
        self.assertEqual(data['description'], 'New Description')
        self.assertEqual(data['is_milestone'], True)

        # Verify it was actually added to the database
        response = self.client.get('/api/tasks')
        data = json.loads(response.data)
        self.assertEqual(len(data), 2)

    def test_update_task(self):
        """Test updating a task"""
        update_data = {
            'name': 'Updated Task',
            'description': 'Updated Description'
        }

        response = self.client.put(
            f'/api/tasks/{self.task_id}',
            data=json.dumps(update_data),
            content_type='application/json'
        )

        self.assertEqual(response.status_code, 200)

        # Verify the update was successful
        response = self.client.get(f'/api/tasks/{self.task_id}')
        data = json.loads(response.data)
        self.assertEqual(data['name'], 'Updated Task')
        self.assertEqual(data['description'], 'Updated Description')

    def test_delete_task(self):
        """Test deleting a task"""
        response = self.client.delete(f'/api/tasks/{self.task_id}')
        self.assertEqual(response.status_code, 200)

        # Verify the task was deleted
        response = self.client.get('/api/tasks')
        data = json.loads(response.data)
        self.assertEqual(len(data), 0)

    def test_complete_task(self):
        """Test marking a task as complete"""
        response = self.client.put(f'/api/tasks/{self.task_id}/complete')
        self.assertEqual(response.status_code, 200)

        # Verify the task was marked as complete
        response = self.client.get(f'/api/tasks/{self.task_id}')
        data = json.loads(response.data)
        self.assertEqual(data['is_completed'], True)
        self.assertIsNotNone(data['completion_date'])

if __name__ == '__main__':
    unittest.main()
