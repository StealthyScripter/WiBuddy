import os
from dotenv import load_dotenv
import secrets

# Load variables from .env file
load_dotenv()

class Config:
    #Database configuration
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL','sqlite:///wibuddy.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # Security configuration
    SECRET_KEY = os.environ.get('SECRET_KEY', secrets.token_hex(16))

    # JWT configuration
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', secrets.token_hex(32))
    JWT_ACCESS_TOKEN_EXPIRES = int(os.environ.get('JWT_ACCESS_TOKEN_EXPIRES', 86400))  # 24 hours in seconds

    # CORS configuration
    CORS_HEADERS = 'Content-Type'

    # API configuration
    API_TITLE = 'Task Manager API'
    API_VERSION = '1.0'
    API_DESCRIPTION = 'A RESTful API for task management'
