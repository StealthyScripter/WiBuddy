from flask_restful import Resource
from app.services.project_service import ProjectService
from flask import request, g
from datetime import datetime
from app.schemas import ProjectSchema
from marshmallow import ValidationError
from app.resources.auth_resource import token_required

# Create schema instances
project_schema = ProjectSchema()
projects_schema = ProjectSchema(many=True)

class ProjectListResource(Resource):
    @token_required
    def get(self):
        """List all projects"""
        projects = ProjectService.get_all_projects()
        return projects_schema.dump(projects)

    @token_required
    def post(self):
        """Create a new project"""
        try:
            # Get JSON data
            json_data = request.get_json()
            if not json_data:
                return {"message": "No input data provided"}, 400

            # Validate with schema
            data = project_schema.load(json_data)

            # Convert date string to datetime if provided
            due_date = data.get('due_date')
            if due_date and isinstance(due_date, str):
                try:
                    data['due_date'] = datetime.strptime(due_date, '%Y-%m-%d').date()
                except ValueError:
                    return {"message": "Invalid date format. Use YYYY-MM-DD."}, 400

            # Add the project
            project = ProjectService.add_project(**data)

            return project_schema.dump(project), 201

        except ValidationError as err:
            return {"message": "Validation error", "errors": err.messages}, 400
        except Exception as e:
            return {"message": f"Error creating project: {str(e)}"}, 500

class ProjectResource(Resource):
    @token_required
    def get(self, project_id):
        """Get a project by ID"""
        try:
            project = ProjectService.get_project(project_id)
            return self._format_project(project)
        except Exception as e:
            return {"message": f"Error retrieving project: {str(e)}"}, 404

    @token_required
    def put(self, project_id):
        """Update a project"""
        try:
            # Get JSON data
            json_data = request.get_json()
            if not json_data:
                return {"message": "No input data provided"}, 400

            # Get the existing project to check if it exists
            existing_project = ProjectService.get_project(project_id)

            # Partially validate the data
            data = project_schema.load(json_data, partial=True)

            # Process due_date if provided
            due_date = data.get('due_date')
            if due_date and isinstance(due_date, str):
                try:
                    data['due_date'] = datetime.strptime(due_date, '%Y-%m-%d').date()
                except ValueError:
                    return {"message": "Invalid date format. Use YYYY-MM-DD."}, 400

            # Update the project
            ProjectService.update_project(project_id, **data)

            # Return the updated project
            updated_project = ProjectService.get_project(project_id)
            return project_schema.dump(updated_project), 200

        except ValidationError as err:
            return {"message": "Validation error", "errors": err.messages}, 400
        except Exception as e:
            return {"message": f"Error updating project: {str(e)}"}, 500

    @token_required
    def delete(self, project_id):
        """Delete a project"""
        try:
            ProjectService.delete_project(project_id)
            return {'message': 'Project deleted successfully'}, 200
        except Exception as e:
            return {"message": f"Error deleting project: {str(e)}"}, 500

    def _format_project(self, project):
        """Format a single project for API response with related data"""
        # Start with the basic schema dump
        result = project_schema.dump(project)

        # Add related data
        result.update({
            'tasks': [{'id': task.id, 'name': task.name} for task in project.tasks],
            'milestones': [{'id': task.id, 'name': task.name} for task in project.project_milestones()]
        })

        return result

class ProjectCompleteResource(Resource):
    @token_required
    def put(self, project_id):
        """Mark a project as complete"""
        try:
            ProjectService.complete_project(project_id)
            return {'message': 'Project marked as complete'}, 200
        except Exception as e:
            return {"message": f"Error completing project: {str(e)}"}, 500
