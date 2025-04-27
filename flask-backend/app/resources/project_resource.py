from flask_restful import Resource, reqparse
from app.services.project_service import ProjectService
from flask import request
from datetime import datetime

class ProjectListResource(Resource):
    def get(self):
        """List all projects"""
        projects = ProjectService.get_all_projects()
        return [self._format_project(project) for project in projects]

    def post(self):
        """Create a new project"""
        parser = reqparse.RequestParser()
        parser.add_argument('name', type=str, required=True, help='Name is required')
        parser.add_argument('description', type=str)
        parser.add_argument('due_date', type=str)
        parser.add_argument('is_completed', type=bool, default=False)

        args = parser.parse_args()

        project = ProjectService.add_project(**args)
        return self._format_project(project), 201

    def _format_project(self, project):
        """Format a single project for API response"""
        return {
            'id': project.id,
            'name': project.name,
            'description': project.description,
            'date_created': project.date_created.isoformat() if project.date_created else None,
            'due_date': project.due_date.isoformat() if project.due_date else None,
            'completion_date': project.completion_date.isoformat() if project.completion_date else None,
            'is_completed': project.is_completed,
            'progress': project.project_progress()
        }

class ProjectResource(Resource):
    def get(self, project_id):
        """Get a project by ID"""
        project = ProjectService.get_project(project_id)
        return self._format_project(project)

    def put(self, project_id):
        """Update a project"""
        parser = reqparse.RequestParser()
        parser.add_argument('name', type=str)
        parser.add_argument('description', type=str)
        parser.add_argument('due_date', type=str)
        parser.add_argument('is_completed', type=bool)

        args = parser.parse_args()

        # Filter out None values
        args = {k: v for k, v in args.items() if v is not None}

        ProjectService.update_project(project_id, **args)
        return {'message': 'Project updated successfully'}, 200

    def delete(self, project_id):
        """Delete a project"""
        ProjectService.delete_project(project_id)
        return {'message': 'Project deleted successfully'}, 200

    def _format_project(self, project):
        """Format a single project for API response"""
        return {
            'id': project.id,
            'name': project.name,
            'description': project.description,
            'date_created': project.date_created.isoformat() if project.date_created else None,
            'due_date': project.due_date.isoformat() if project.due_date else None,
            'completion_date': project.completion_date.isoformat() if project.completion_date else None,
            'is_completed': project.is_completed,
            'progress': project.project_progress(),
            'tasks': [{'id': task.id, 'name': task.name} for task in project.tasks],
            'milestones': [{'id': task.id, 'name': task.name} for task in project.project_milestones()]
        }

class ProjectCompleteResource(Resource):
    def put(self, project_id):
        """Mark a project as complete"""
        ProjectService.complete_project(project_id)
        return {'message': 'Project marked as complete'}, 200
