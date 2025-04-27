from flask_restful import Resource, reqparse
from app.services.utility_service import AffirmationService
from flask import request

class AffirmationListResource(Resource):
    def get(self):
        """List all affirmations"""
        affirmations = AffirmationService.get_all_affirmations()
        return [self._format_affirmation(aff) for aff in affirmations]

    def post(self):
        """Create a new affirmation"""
        parser = reqparse.RequestParser()
        parser.add_argument('affirmation', type=str, required=True, help='Affirmation text is required')
        parser.add_argument('daily_goals', type=str)

        args = parser.parse_args()

        affirmation = AffirmationService.add_affirmation(
            args['affirmation'],
            args.get('daily_goals', '')
        )
        return self._format_affirmation(affirmation), 201

    def _format_affirmation(self, affirmation):
        """Format a single affirmation for API response"""
        return {
            'id': affirmation.id,
            'affirmation': affirmation.affirmation,
            'daily_goals': affirmation.daily_goals
        }

class AffirmationResource(Resource):
    def get(self, affirmation_id):
        """Get an affirmation by ID"""
        affirmation = AffirmationService.get_affirmation(affirmation_id)
        return self._format_affirmation(affirmation)

    def put(self, affirmation_id):
        """Update an affirmation"""
        parser = reqparse.RequestParser()
        parser.add_argument('affirmation', type=str)
        parser.add_argument('daily_goals', type=str)

        args = parser.parse_args()

        # Get the affirmation entry if it exists
        entry = args.get('affirmation')

        AffirmationService.update_affirmation(affirmation_id, entry)
        return {'message': 'Affirmation updated successfully'}, 200

    def delete(self, affirmation_id):
        """Delete an affirmation"""
        AffirmationService.delete_affirmation(affirmation_id)
        return {'message': 'Affirmation deleted successfully'}, 200

    def _format_affirmation(self, affirmation):
        """Format a single affirmation for API response"""
        return {
            'id': affirmation.id,
            'affirmation': affirmation.affirmation,
            'daily_goals': affirmation.daily_goals
        }
