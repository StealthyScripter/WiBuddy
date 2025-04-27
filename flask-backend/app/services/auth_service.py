from app import db
from app.models import User
from sqlalchemy.exc import SQLAlchemyError
from datetime import datetime, timedelta
import jwt
from flask import current_app

class AuthService:
    @staticmethod
    def register_user(username, email, password, is_admin=False):
        """Register a new user"""
        try:
            # Check if user already exists
            if User.query.filter_by(username=username).first():
                return None, "Username already exists"

            if User.query.filter_by(email=email).first():
                return None, "Email already exists"

            # Create new user
            new_user = User(
                username=username,
                email=email,
                is_admin=is_admin
            )
            new_user.set_password(password)

            db.session.add(new_user)
            db.session.commit()
            return new_user, None
        except SQLAlchemyError as e:
            db.session.rollback()
            return None, f"Database error: {str(e)}"

    @staticmethod
    def authenticate_user(username, password):
        """Authenticate a user and return a JWT token"""
        try:
            user = User.query.filter_by(username=username).first()

            if not user or not user.check_password(password):
                return None, "Invalid username or password"

            # Generate JWT token
            payload = {
                'user_id': user.id,
                'is_admin': user.is_admin,
                'exp': datetime.utcnow() + timedelta(days=1)  # Token expires in 1 day
            }

            token = jwt.encode(
                payload,
                current_app.config.get('SECRET_KEY', 'dev-key'),
                algorithm='HS256'
            )

            return {'token': token, 'user_id': user.id, 'username': user.username}, None
        except Exception as e:
            return None, f"Authentication error: {str(e)}"

    @staticmethod
    def get_user_by_id(user_id):
        """Get a user by ID"""
        return User.query.get(user_id)

    @staticmethod
    def get_all_users():
        """Get all users (admin only)"""
        return User.query.all()

    @staticmethod
    def delete_user(user_id):
        """Delete a user (admin only)"""
        try:
            user = User.query.get_or_404(user_id)
            db.session.delete(user)
            db.session.commit()
            return True, None
        except SQLAlchemyError as e:
            db.session.rollback()
            return False, f"Database error: {str(e)}"

    @staticmethod
    def update_user(user_id, username=None, email=None, password=None, is_admin=None):
        """Update a user"""
        try:
            user = User.query.get_or_404(user_id)

            if username:
                # Check if username is taken by another user
                existing_user = User.query.filter_by(username=username).first()
                if existing_user and existing_user.id != user_id:
                    return None, "Username already taken"
                user.username = username

            if email:
                # Check if email is taken by another user
                existing_user = User.query.filter_by(email=email).first()
                if existing_user and existing_user.id != user_id:
                    return None, "Email already taken"
                user.email = email

            if password:
                user.set_password(password)

            if is_admin is not None:
                user.is_admin = is_admin

            db.session.commit()
            return user, None
        except SQLAlchemyError as e:
            db.session.rollback()
            return None, f"Database error: {str(e)}"
