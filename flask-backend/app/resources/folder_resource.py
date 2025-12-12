from flask_restful import Resource
from app.services.notes_service import FolderService
from flask import request
from app.schemas import FolderSchema
from marshmallow import ValidationError
from app.resources.auth_resource import token_required

# Create schema instances
folder_schema = FolderSchema()
folders_schema = FolderSchema(many=True)

class FolderListResource(Resource):
    @token_required
    def get(self):
        """List all folders with optional filters"""
        user_id = request.args.get('user_id', type=int)
        parent_id = request.args.get('parent_id', type=int)

        folders = FolderService.get_all_folders(
            user_id=user_id,
            parent_id=parent_id
        )
        return folders_schema.dump(folders)

    @token_required
    def post(self):
        """Create a new folder"""
        try:
            json_data = request.get_json()
            if not json_data:
                return {"message": "No input data provided"}, 400

            # Validate with schema
            data = folder_schema.load(json_data)

            # Create the folder
            folder = FolderService.add_folder(**data)

            return folder_schema.dump(folder), 201

        except ValidationError as err:
            return {"message": "Validation error", "errors": err.messages}, 400
        except Exception as e:
            return {"message": f"Error creating folder: {str(e)}"}, 500


class FolderResource(Resource):
    @token_required
    def get(self, folder_id):
        """Get a folder by ID"""
        try:
            folder = FolderService.get_folder(folder_id)
            return folder_schema.dump(folder)
        except Exception as e:
            return {"message": f"Error retrieving folder: {str(e)}"}, 404

    @token_required
    def put(self, folder_id):
        """Update a folder"""
        try:
            json_data = request.get_json()
            if not json_data:
                return {"message": "No input data provided"}, 400

            # Validate the data
            data = folder_schema.load(json_data, partial=True)

            # Update the folder
            updated_folder = FolderService.update_folder(folder_id, **data)

            return folder_schema.dump(updated_folder), 200

        except ValidationError as err:
            return {"message": "Validation error", "errors": err.messages}, 400
        except Exception as e:
            return {"message": f"Error updating folder: {str(e)}"}, 500

    @token_required
    def delete(self, folder_id):
        """Delete a folder"""
        try:
            FolderService.delete_folder(folder_id)
            return {'message': 'Folder deleted successfully'}, 200
        except Exception as e:
            return {"message": f"Error deleting folder: {str(e)}"}, 500
