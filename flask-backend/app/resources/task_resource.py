from flask_restful import Resource, reqparse
from app.services.task_service import TaskService
from flask import request, jsonify
from datetime import datetime

class TaskListResource(Resource):
    def get(self):
        """List all tasks"""
        tasks = TaskService.get_all_tasks()
        return [self._format_task(task) for task in tasks]

    def post(self):
        """Create a new task"""
        parser = reqparse.RequestParser()
        parser.add_argument('name', type=str, required=True, help='Name is required')
        parser.add_argument('description', type=str)
        parser.add_argument('due_date', type=str)
        parser.add_argument('estimated_duration', type=int)
        parser.add_argument('project_id', type=int)
        parser.add_argument('technology_id', type=int)
        parser.add_argument('is_milestone', type=bool, default=False)

        args = parser.parse_args()

        task = TaskService.add_task(**args)
        return self._format_task(task), 201

    def _format_task(self, task):
        """Format a single task for API response"""
        return {
            'id': task.id,
            'name': task.name,
            'description': task.description,
            'is_completed': task.is_completed,
            'date_created': task.date_created.isoformat() if task.date_created else None,
            'due_date': task.due_date.isoformat() if task.due_date else None,
            'estimated_duration': task.estimated_duration,
            'is_milestone': task.is_milestone,
            'project_id': task.project_id,
            'technology_id': task.technology_id,
            'completion_date': task.completion_date.isoformat() if task.completion_date else None
        }

class TaskResource(Resource):
    def get(self, task_id):
        """Get a task by ID"""
        task = TaskService.get_task(task_id)
        return {
            'id': task.id,
            'name': task.name,
            'description': task.description,
            'is_completed': task.is_completed,
            'date_created': task.date_created.isoformat() if task.date_created else None,
            'due_date': task.due_date.isoformat() if task.due_date else None,
            'estimated_duration': task.estimated_duration,
            'is_milestone': task.is_milestone,
            'project_id': task.project_id,
            'technology_id': task.technology_id,
            'completion_date': task.completion_date.isoformat() if task.completion_date else None
        }

    def put(self, task_id):
        """Update a task"""
        parser = reqparse.RequestParser()
        parser.add_argument('name', type=str)
        parser.add_argument('description', type=str)
        parser.add_argument('is_completed', type=bool)
        parser.add_argument('due_date', type=str)
        parser.add_argument('estimated_duration', type=int)
        parser.add_argument('project_id', type=int)
        parser.add_argument('technology_id', type=int)
        parser.add_argument('is_milestone', type=bool)

        args = parser.parse_args()

        # Get the existing task to get its current name and due_date if not provided
        existing_task = TaskService.get_task(task_id)
        if 'name' not in args or args['name'] is None:
            args['name'] = existing_task.name
        if 'due_date' not in args or args['due_date'] is None:
            args['due_date'] = existing_task.due_date.strftime('%Y-%m-%d') if existing_task.due_date else None

        # Filter out None values
        args = {k: v for k, v in args.items() if v is not None}

        TaskService.update_task(task_id, **args)
        return {'message': 'Task updated successfully'}, 200

    def delete(self, task_id):
        """Delete a task"""
        TaskService.delete_task(task_id)
        return {'message': 'Task deleted successfully'}, 200

class TaskCompleteResource(Resource):
    def put(self, task_id):
        """Mark a task as complete"""
        TaskService.complete_task(task_id, True)
        return {'message': 'Task marked as complete'}, 200

    def delete(self, task_id):
        """Mark a task as incomplete"""
        TaskService.complete_task(task_id, False)
        return {'message': 'Task marked as incomplete'}, 200
