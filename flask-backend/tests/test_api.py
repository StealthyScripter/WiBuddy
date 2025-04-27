# tests/test_api.py
import unittest
import json
from datetime import datetime, timedelta
from app import app, db
from app.models import Task, Project, Technology, Affirmation

class ApiTestCase(unittest.TestCase):
    def setUp(self):
        app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
        app.config['TESTING'] = True
        self.client = app.test_client()

        with app.app_context():
            db.create_all()

            # Create test data
            project = Project(name="Test Project", description="Test Project Description")
            technology = Technology(name="Test Technology", description="Test Technology Description")
            affirmation = Affirmation(affirmation="Test Affirmation", daily_goals="Test Goals")

            db.session.add_all([project, technology, affirmation])
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
            self.affirmation_id = affirmation.id

    def tearDown(self):
        with app.app_context():
            db.session.remove()
            db.drop_all()

    # Task API tests
    def test_get_all_tasks(self):
        """Test getting all tasks"""
        response = self.client.get('/api/tasks')
        self.assertEqual(response.status_code, 200)

        data = json.loads(response.data)
        self.assertIsInstance(data, list)
        self.assertEqual(len(data), 1)
        self.assertEqual(data[0]['name'], "Test Task")

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

    # Project API tests
    def test_get_all_projects(self):
        """Test getting all projects"""
        response = self.client.get('/api/projects')
        self.assertEqual(response.status_code, 200)

        data = json.loads(response.data)
        self.assertIsInstance(data, list)
        self.assertEqual(len(data), 1)
        self.assertEqual(data[0]['name'], "Test Project")

    def test_create_project(self):
        """Test creating a new project"""
        project_data = {
            'name': 'New Project',
            'description': 'New Project Description',
            'due_date': (datetime.utcnow() + timedelta(days=30)).strftime('%Y-%m-%d')
        }

        response = self.client.post(
            '/api/projects',
            data=json.dumps(project_data),
            content_type='application/json'
        )

        self.assertEqual(response.status_code, 201)

        data = json.loads(response.data)
        self.assertEqual(data['name'], 'New Project')
        self.assertEqual(data['description'], 'New Project Description')

    # Technology API tests
    def test_get_all_technologies(self):
        """Test getting all technologies"""
        response = self.client.get('/api/technologies')
        self.assertEqual(response.status_code, 200)

        data = json.loads(response.data)
        self.assertIsInstance(data, list)
        self.assertEqual(len(data), 1)
        self.assertEqual(data[0]['name'], "Test Technology")

    def test_create_technology(self):
        """Test creating a new technology"""
        tech_data = {
            'name': 'New Technology',
            'description': 'New Technology Description'
        }

        response = self.client.post(
            '/api/technologies',
            data=json.dumps(tech_data),
            content_type='application/json'
        )

        self.assertEqual(response.status_code, 201)

        data = json.loads(response.data)
        self.assertEqual(data['name'], 'New Technology')
        self.assertEqual(data['description'], 'New Technology Description')

    # Affirmation API tests
    def test_get_all_affirmations(self):
        """Test getting all affirmations"""
        response = self.client.get('/api/affirmations')
        self.assertEqual(response.status_code, 200)

        data = json.loads(response.data)
        self.assertIsInstance(data, list)
        self.assertEqual(len(data), 1)
        self.assertEqual(data[0]['affirmation'], "Test Affirmation")

    def test_create_affirmation(self):
        """Test creating a new affirmation"""
        affirmation_data = {
            'affirmation': 'New Affirmation',
            'daily_goals': 'New Daily Goals'
        }

        response = self.client.post(
            '/api/affirmations',
            data=json.dumps(affirmation_data),
            content_type='application/json'
        )

        self.assertEqual(response.status_code, 201)

        data = json.loads(response.data)
        self.assertEqual(data['affirmation'], 'New Affirmation')
        self.assertEqual(data['daily_goals'], 'New Daily Goals')

if __name__ == '__main__':
    unittest.main()
