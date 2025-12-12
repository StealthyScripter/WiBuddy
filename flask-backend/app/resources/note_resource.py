from flask_restful import Resource
from app.services.notes_service import NoteService
from flask import request
from app.schemas import NoteSchema
from marshmallow import ValidationError
from app.resources.auth_resource import token_required

# Create schema instances
note_schema = NoteSchema()
notes_schema = NoteSchema(many=True)

class NoteListResource(Resource):
    @token_required
    def get(self):
        """List all notes with optional filters"""
        user_id = request.args.get('user_id', type=int)
        folder_id = request.args.get('folder_id', type=int)
        module_id = request.args.get('module_id', type=int)
        tags = request.args.getlist('tags')  # Support multiple tags

        notes = NoteService.get_all_notes(
            user_id=user_id,
            folder_id=folder_id,
            module_id=module_id,
            tags=tags if tags else None
        )
        return notes_schema.dump(notes)

    @token_required
    def post(self):
        """Create a new note"""
        try:
            json_data = request.get_json()
            if not json_data:
                return {"message": "No input data provided"}, 400

            # Validate with schema
            data = note_schema.load(json_data)

            # Create the note
            note = NoteService.add_note(**data)

            return note_schema.dump(note), 201

        except ValidationError as err:
            return {"message": "Validation error", "errors": err.messages}, 400
        except Exception as e:
            return {"message": f"Error creating note: {str(e)}"}, 500


class NoteResource(Resource):
    @token_required
    def get(self, note_id):
        """Get a note by ID"""
        try:
            note = NoteService.get_note(note_id)
            return note_schema.dump(note)
        except Exception as e:
            return {"message": f"Error retrieving note: {str(e)}"}, 404

    @token_required
    def put(self, note_id):
        """Update a note"""
        try:
            json_data = request.get_json()
            if not json_data:
                return {"message": "No input data provided"}, 400

            # Validate the data
            data = note_schema.load(json_data, partial=True)

            # Update the note
            updated_note = NoteService.update_note(note_id, **data)

            return note_schema.dump(updated_note), 200

        except ValidationError as err:
            return {"message": "Validation error", "errors": err.messages}, 400
        except Exception as e:
            return {"message": f"Error updating note: {str(e)}"}, 500

    @token_required
    def delete(self, note_id):
        """Delete a note"""
        try:
            NoteService.delete_note(note_id)
            return {'message': 'Note deleted successfully'}, 200
        except Exception as e:
            return {"message": f"Error deleting note: {str(e)}"}, 500


class NoteSearchResource(Resource):
    @token_required
    def get(self):
        """Search notes"""
        query_string = request.args.get('q', '')
        user_id = request.args.get('user_id', type=int)

        if not query_string:
            return {"message": "Search query is required"}, 400

        try:
            notes = NoteService.search_notes(query_string, user_id)
            return notes_schema.dump(notes)
        except Exception as e:
            return {"message": f"Error searching notes: {str(e)}"}, 500
