from flask_restful import Resource, reqparse
from app.services.auth_service import AuthService
from app.schemas import UserSchema, UserLoginSchema
from marshmallow import ValidationError
from flask import request, g, jsonify
import jwt
from functools import wraps
from flask import current_app

# Schema instances
user_schema = UserSchema()
users_schema = UserSchema(many=True)
login_schema = UserLoginSchema()

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None

        # Get token from Authorization header
        auth_header = request.headers.get('Authorization')
        if auth_header and auth_header.startswith('Bearer '):
            token = auth_header.split(' ')[1]

        if not token:
            return {'message': 'Token is missing'}, 401

        try:
            # Decode token
            data = jwt.decode(
                token,
                current_app.config.get('SECRET_KEY', 'dev-key'),
                algorithms=['HS256']
            )

            # Set current user in flask g
            g.user_id = data['user_id']
            g.is_admin = data['is_admin']

        except jwt.ExpiredSignatureError:
            return {'message': 'Token has expired'}, 401
        except jwt.InvalidTokenError:
            return {'message': 'Invalid token'}, 401

        return f(*args, **kwargs)
    return decorated

def admin_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        if not g.get('is_admin', False):
            return {'message': 'Admin privileges required'}, 403
        return f(*args, **kwargs)
    return decorated

class RegisterResource(Resource):
    def post(self):
        """Register a new user"""
        try:
            # Validate input data
            json_data = request.get_json()
            if not json_data:
                return {"message": "No input data provided"}, 400

            # Validate with schema
            data = user_schema.load(json_data)

            # Register user
            user, error = AuthService.register_user(
                username=data['username'],
                email=data['email'],
                password=data['password'],
                is_admin=data.get('is_admin', False)
            )

            if error:
                return {"message": error}, 400

            return user_schema.dump(user), 201

        except ValidationError as err:
            return {"message": "Validation error", "errors": err.messages}, 400
        except Exception as e:
            return {"message": f"Error: {str(e)}"}, 500

class LoginResource(Resource):
    def post(self):
        """User login"""
        try:
            # Validate input data
            json_data = request.get_json()
            if not json_data:
                return {"message": "No input data provided"}, 400

            # Validate with schema
            data = login_schema.load(json_data)

            # Authenticate user
            auth_data, error = AuthService.authenticate_user(
                username=data['username'],
                password=data['password']
            )

            if error:
                return {"message": error}, 401

            return auth_data, 200

        except ValidationError as err:
            return {"message": "Validation error", "errors": err.messages}, 400
        except Exception as e:
            return {"message": f"Error: {str(e)}"}, 500

class UserListResource(Resource):
    @token_required
    @admin_required
    def get(self):
        """Get all users (admin only)"""
        users = AuthService.get_all_users()
        return users_schema.dump(users), 200

class UserResource(Resource):
    @token_required
    def get(self, user_id):
        """Get user details"""
        # Only allow users to access their own data or admin users to access any data
        if g.user_id != user_id and not g.is_admin:
            return {"message": "Unauthorized access"}, 403

        user = AuthService.get_user_by_id(user_id)
        if not user:
            return {"message": "User not found"}, 404

        return user_schema.dump(user), 200

    @token_required
    def put(self, user_id):
        """Update user details"""
        # Only allow users to update their own data or admin users to update any data
        if g.user_id != user_id and not g.is_admin:
            return {"message": "Unauthorized access"}, 403

        try:
            # Validate input data
            json_data = request.get_json()
            if not json_data:
                return {"message": "No input data provided"}, 400

            # Extract data (without validation since partial update)
            username = json_data.get('username')
            email = json_data.get('email')
            password = json_data.get('password')
            is_admin = json_data.get('is_admin')

            # Only admins can update admin status
            if is_admin is not None and not g.is_admin:
                return {"message": "Unauthorized to change admin status"}, 403

            # Update user
            user, error = AuthService.update_user(
                user_id=user_id,
                username=username,
                email=email,
                password=password,
                is_admin=is_admin
            )

            if error:
                return {"message": error}, 400

            return user_schema.dump(user), 200

        except Exception as e:
            return {"message": f"Error: {str(e)}"}, 500

    @token_required
    @admin_required
    def delete(self, user_id):
        """Delete a user (admin only)"""
        success, error = AuthService.delete_user(user_id)

        if error:
            return {"message": error}, 400

        return {"message": "User deleted successfully"}, 200
