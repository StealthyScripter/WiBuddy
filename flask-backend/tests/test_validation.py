#!/usr/bin/env python
"""
Validation Testing Script for Task Manager

This script tests the validation schemas to ensure they work correctly.
"""

import sys
import os
import unittest
from datetime import datetime, timedelta

# Add the parent directory to the Python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.schemas import (
    TaskSchema,
    ProjectSchema,
    TechnologySchema,
    AffirmationSchema
)
from marshmallow import ValidationError

class ValidationTestCase(unittest.TestCase):
    def test_task_validation(self):
        """Test task validation schema"""
        schema = TaskSchema()

        # Valid task
        valid_task = {
            'name': 'Test Task',
            'description': 'Test description',
            'due_date': (datetime.today() + timedelta(days=7)).strftime('%Y-%m-%d'),
            'estimated_duration': 10,
            'is_milestone': False
        }
        result = schema.load(valid_task)
        self.assertEqual(result['name'], 'Test Task')

        # Invalid task - missing name
        invalid_task = {
            'description': 'Test description',
            'due_date': (datetime.today() + timedelta(days=7)).strftime('%Y-%m-%d')
        }
        with self.assertRaises(ValidationError):
            schema.load(invalid_task)

        # Invalid task - past due date
        invalid_date_task = {
            'name': 'Test Task',
            'due_date': (datetime.today() - timedelta(days=7)).strftime('%Y-%m-%d')
        }
        with self.assertRaises(ValidationError):
            schema.load(invalid_date_task)

        # Invalid task - name too long
        long_name_task = {
            'name': 'x' * 201,  # 201 characters
            'description': 'Test description'
        }
        with self.assertRaises(ValidationError):
            schema.load(long_name_task)

        # Invalid task - negative duration
        negative_duration_task = {
            'name': 'Test Task',
            'estimated_duration': -5
        }
        with self.assertRaises(ValidationError):
            schema.load(negative_duration_task)

    def test_project_validation(self):
        """Test project validation schema"""
        schema = ProjectSchema()

        # Valid project
        valid_project = {
            'name': 'Test Project',
            'description': 'Test project description',
            'due_date': (datetime.today() + timedelta(days=30)).strftime('%Y-%m-%d'),
            'is_completed': False
        }
        result = schema.load(valid_project)
        self.assertEqual(result['name'], 'Test Project')

        # Invalid project - missing name
        invalid_project = {
            'description': 'Test project description',
            'due_date': (datetime.today() + timedelta(days=30)).strftime('%Y-%m-%d')
        }
        with self.assertRaises(ValidationError):
            schema.load(invalid_project)

        # Invalid project - past due date
        invalid_date_project = {
            'name': 'Test Project',
            'due_date': (datetime.today() - timedelta(days=7)).strftime('%Y-%m-%d')
        }
        with self.assertRaises(ValidationError):
            schema.load(invalid_date_project)

    def test_technology_validation(self):
        """Test technology validation schema"""
        schema = TechnologySchema()

        # Valid technology
        valid_tech = {
            'name': 'Python',
            'description': 'Programming language'
        }
        result = schema.load(valid_tech)
        self.assertEqual(result['name'], 'Python')

        # Invalid technology - missing name
        invalid_tech = {
            'description': 'Programming language'
        }
        with self.assertRaises(ValidationError):
            schema.load(invalid_tech)

        # Invalid technology - name too long
        long_name_tech = {
            'name': 'x' * 51,  # 51 characters
            'description': 'Programming language'
        }
        with self.assertRaises(ValidationError):
            schema.load(long_name_tech)

    def test_affirmation_validation(self):
        """Test affirmation validation schema"""
        schema = AffirmationSchema()

        # Valid affirmation
        valid_affirmation = {
            'affirmation': 'I am doing great today!',
            'daily_goals': 'Complete 3 tasks'
        }
        result = schema.load(valid_affirmation)
        self.assertEqual(result['affirmation'], 'I am doing great today!')

        # Invalid affirmation - missing affirmation text
        invalid_affirmation = {
            'daily_goals': 'Complete 3 tasks'
        }
        with self.assertRaises(ValidationError):
            schema.load(invalid_affirmation)

        # Invalid affirmation - affirmation text too long
        long_text_affirmation = {
            'affirmation': 'x' * 501,  # 501 characters
            'daily_goals': 'Complete 3 tasks'
        }
        with self.assertRaises(ValidationError):
            schema.load(long_text_affirmation)

        # Invalid affirmation - daily goals too long
        long_goals_affirmation = {
            'affirmation': 'I am doing great today!',
            'daily_goals': 'x' * 502  # 502 characters
        }
        with self.assertRaises(ValidationError):
            schema.load(long_goals_affirmation)

if __name__ == '__main__':
    unittest.main()
