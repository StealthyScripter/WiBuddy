import unittest
import json
from app import app, db
from app.models import User

class AuthTestCase(unittest.TestCase):
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

    def test_user_registration(self):
        """Test user registration"""
        response = self.client.post(
            '/api/auth/register',
            data=json.dumps({
                'username': 'testuser',
                'email': 'test@example.com',
                'password': 'Test@123'
            }),
            content_type='application/json'
        )

        self.assertEqual(response.status_code, 201)

        data = json.loads(response.data)
        self.assertEqual(data['username'], 'testuser')
        self.assertEqual(data['email'], 'test@example.com')
        self.assertNotIn('password', data)

        # Check user was created in database
        with app.app_context():
            user = User.query.filter_by(username='testuser').first()
            self.assertIsNotNone(user)
            self.assertEqual(user.email, 'test@example.com')
            self.assertFalse(user.is_admin)

    def test_user_login(self):
        """Test user login"""
        # First register a user
        self.client.post(
            '/api/auth/register',
            data=json.dumps({
                'username': 'testuser',
                'email': 'test@example.com',
                'password': 'Test@123'
            }),
            content_type='application/json'
        )

        # Now try to login
        response = self.client.post(
            '/api/auth/login',
            data=json.dumps({
                'username': 'testuser',
                'password': 'Test@123'
            }),
            content_type='application/json'
        )

        self.assertEqual(response.status_code, 200)

        data = json.loads(response.data)
        self.assertIn('token', data)
        self.assertEqual(data['username'], 'testuser')

    def test_invalid_login(self):
        """Test login with invalid credentials"""
        response = self.client.post(
            '/api/auth/login',
            data=json.dumps({
                'username': 'nonexistent',
                'password': 'wrongpassword'
            }),
            content_type='application/json'
        )

        self.assertEqual(response.status_code, 401)

    def test_protected_endpoint(self):
        """Test accessing a protected endpoint with and without token"""
        # First register and login to get a token
        self.client.post(
            '/api/auth/register',
            data=json.dumps({
                'username': 'testuser',
                'email': 'test@example.com',
                'password': 'Test@123'
            }),
            content_type='application/json'
        )

        login_response = self.client.post(
            '/api/auth/login',
            data=json.dumps({
                'username': 'testuser',
                'password': 'Test@123'
            }),
            content_type='application/json'
        )

        token = json.loads(login_response.data)['token']

        # Try accessing a protected endpoint without token
        response = self.client.get('/api/tasks')
        self.assertEqual(response.status_code, 401)

        # Try accessing with token
        response = self.client.get(
            '/api/tasks',
            headers={'Authorization': f'Bearer {token}'}
        )
        self.assertEqual(response.status_code, 200)

    def test_admin_endpoint(self):
        """Test admin-only endpoint"""
        # Register regular user
        self.client.post(
            '/api/auth/register',
            data=json.dumps({
                'username': 'regularuser',
                'email': 'regular@example.com',
                'password': 'Regular@123'
            }),
            content_type='application/json'
        )

        # Register admin user (manually set admin flag in DB)
        self.client.post(
            '/api/auth/register',
            data=json.dumps({
                'username': 'adminuser',
                'email': 'admin@example.com',
                'password': 'Admin@123'
            }),
            content_type='application/json'
        )

        with app.app_context():
            admin = User.query.filter_by(username='adminuser').first()
            admin.is_admin = True
            db.session.commit()

        # Login as regular user
        login_response = self.client.post(
            '/api/auth/login',
            data=json.dumps({
                'username': 'regularuser',
                'password': 'Regular@123'
            }),
            content_type='application/json'
        )

        regular_token = json.loads(login_response.data)['token']

        # Login as admin user
        login_response = self.client.post(
            '/api/auth/login',
            data=json.dumps({
                'username': 'adminuser',
                'password': 'Admin@123'
            }),
            content_type='application/json'
        )

        admin_token = json.loads(login_response.data)['token']

        # Try accessing admin endpoint with regular user token
        response = self.client.get(
            '/api/users',
            headers={'Authorization': f'Bearer {regular_token}'}
        )
        self.assertEqual(response.status_code, 403)

        # Try accessing with admin token
        response = self.client.get(
            '/api/users',
            headers={'Authorization': f'Bearer {admin_token}'}
        )
        self.assertEqual(response.status_code, 200)


if __name__ == '__main__':
    unittest.main()
