import unittest
import json
from app import app, db
from app.models import Task, Project

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

    def test_api_root(self):
        response = self.client.get('/')
        self.assertEqual(response.status_code, 200)

    def test_get_tasks_api(self):
        response = self.client.get('/api/tasks')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertIsInstance(data, list)
