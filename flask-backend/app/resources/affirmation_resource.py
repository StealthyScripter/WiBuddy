from flask_restful import Resource
from app.services.utility_service import AffirmationService
from flask import request, g
from app.schemas import AffirmationSchema
from marshmallow import ValidationError
from app.resources.auth_resource import token_required

# Create schema instances
affirmation_schema = AffirmationSchema()
affirmations_schema = AffirmationSchema(many=True)

class AffirmationListResource(Resource):
    @token_required
    def get(self):
        """List all affirmations"""
        affirmations = AffirmationService.get_all_affirmations()
        return affirmations_schema.dump(affirmations)

    @token_required
    def post(self):
        """Create a new affirmation"""
        try:
            # Get JSON data
            json_data = request.get_json()
            if not json_data:
                return {"message": "No input data provided"}, 400

            # Validate with schema
            data = affirmation_schema.load(json_data)

            # Add the affirmation
            affirmation = AffirmationService.add_affirmation(
                data['affirmation'],
                data.get('daily_goals', '')
            )

            return affirmation_schema.dump(affirmation), 201

        except ValidationError as err:
            return {"message": "Validation error", "errors": err.messages}, 400
        except Exception as e:
            return {"message": f"Error creating affirmation: {str(e)}"}, 500

class AffirmationResource(Resource):
    @token_required
    def get(self, affirmation_id):
        """Get an affirmation by ID"""
        try:
            affirmation = AffirmationService.get_affirmation(affirmation_id)
            return affirmation_schema.dump(affirmation)
        except Exception as e:
            return {"message": f"Error retrieving affirmation: {str(e)}"}, 404

    @token_required
    def put(self, affirmation_id):
        """Update an affirmation"""
        try:
            # Get JSON data
            json_data = request.get_json()
            if not json_data:
                return {"message": "No input data provided"}, 400

            # Get the existing affirmation to check if it exists
            existing_affirmation = AffirmationService.get_affirmation(affirmation_id)

            # Partially validate the data
            data = affirmation_schema.load(json_data, partial=True)

            # Get the affirmation text if it exists
            entry = data.get('affirmation')
            daily_goals = data.get('daily_goals')

            # Update the affirmation
            AffirmationService.update_affirmation(affirmation_id, entry, daily_goals)

            # Return the updated affirmation
            updated_affirmation = AffirmationService.get_affirmation(affirmation_id)
            return affirmation_schema.dump(updated_affirmation), 200

        except ValidationError as err:
            return {"message": "Validation error", "errors": err.messages}, 400
        except Exception as e:
            return {"message": f"Error updating affirmation: {str(e)}"}, 500

    @token_required
    def delete(self, affirmation_id):
        """Delete an affirmation"""
        try:
            AffirmationService.delete_affirmation(affirmation_id)
            return {'message': 'Affirmation deleted successfully'}, 200
        except Exception as e:
            return {"message": f"Error deleting affirmation: {str(e)}"}, 500
