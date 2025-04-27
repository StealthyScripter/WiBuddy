from flask_restful import Resource
from app.services.task_service import TaskService
from flask import request, g
from datetime import datetime
from app.schemas import TaskSchema
from marshmallow import ValidationError
from app.resources.auth_resource import token_required

# Create schema instances
task_schema = TaskSchema()
tasks_schema = TaskSchema(many=True)

class TaskListResource(Resource):
    @token_required
    def get(self):
        """List all tasks"""
        tasks = TaskService.get_all_tasks()
        return tasks_schema.dump(tasks)

    @token_required
    def post(self):
        """Create a new task"""
        try:
            # Get JSON data
            json_data = request.get_json()
            if not json_data:
                return {"message": "No input data provided"}, 400

            # Validate with schema
            data = task_schema.load(json_data)

            # Convert date string to datetime if provided
            due_date = data.get('due_date')
            if due_date and isinstance(due_date, str):
                try:
                    data['due_date'] = datetime.strptime(due_date, '%Y-%m-%d').date()
                except ValueError:
                    return {"message": "Invalid date format. Use YYYY-MM-DD."}, 400

            # Add the task
            task = TaskService.add_task(**data)

            return task_schema.dump(task), 201

        except ValidationError as err:
            return {"message": "Validation error", "errors": err.messages}, 400
        except Exception as e:
            return {"message": f"Error creating task: {str(e)}"}, 500

class TaskResource(Resource):
    @token_required
    def get(self, task_id):
        """Get a task by ID"""
        try:
            task = TaskService.get_task(task_id)
            return task_schema.dump(task)
        except Exception as e:
            return {"message": f"Error retrieving task: {str(e)}"}, 404

    @token_required
    def put(self, task_id):
        """Update a task"""
        try:
            # Get JSON data
            json_data = request.get_json()
            if not json_data:
                return {"message": "No input data provided"}, 400

            # Get the existing task to check if it exists
            existing_task = TaskService.get_task(task_id)

            # Partially validate the data
            # We're using partial=True to only validate the fields that are being updated
            data = task_schema.load(json_data, partial=True)

            # Process due_date if provided
            due_date = data.get('due_date')
            if due_date and isinstance(due_date, str):
                try:
                    data['due_date'] = datetime.strptime(due_date, '%Y-%m-%d').date()
                except ValueError:
                    return {"message": "Invalid date format. Use YYYY-MM-DD."}, 400

            # Update the task
            TaskService.update_task(task_id, **data)

            # Return the updated task
            updated_task = TaskService.get_task(task_id)
            return task_schema.dump(updated_task), 200

        except ValidationError as err:
            return {"message": "Validation error", "errors": err.messages}, 400
        except Exception as e:
            return {"message": f"Error updating task: {str(e)}"}, 500

    @token_required
    def delete(self, task_id):
        """Delete a task"""
        try:
            TaskService.delete_task(task_id)
            return {'message': 'Task deleted successfully'}, 200
        except Exception as e:
            return {"message": f"Error deleting task: {str(e)}"}, 500

class TaskCompleteResource(Resource):
    @token_required
    def put(self, task_id):
        """Mark a task as complete"""
        try:
            TaskService.complete_task(task_id, True)
            return {'message': 'Task marked as complete'}, 200
        except Exception as e:
            return {"message": f"Error completing task: {str(e)}"}, 500

    @token_required
    def delete(self, task_id):
        """Mark a task as incomplete"""
        try:
            TaskService.complete_task(task_id, False)
            return {'message': 'Task marked as incomplete'}, 200
        except Exception as e:
            return {"message": f"Error marking task as incomplete: {str(e)}"}, 500
