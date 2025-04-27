from flask_restful import Resource, reqparse
from app.services.utility_service import TechnologyService
from flask import request

class TechnologyListResource(Resource):
    def get(self):
        """List all technologies"""
        technologies = TechnologyService.get_all_technologies()
        return [self._format_technology(tech) for tech in technologies]

    def post(self):
        """Create a new technology"""
        parser = reqparse.RequestParser()
        parser.add_argument('name', type=str, required=True, help='Name is required')
        parser.add_argument('description', type=str)

        args = parser.parse_args()

        tech = TechnologyService.add_tech(**args)
        return self._format_technology(tech), 201

    def _format_technology(self, tech):
        """Format a single technology for API response"""
        return {
            'id': tech.id,
            'name': tech.name,
            'description': tech.description
        }

class TechnologyResource(Resource):
    def get(self, tech_id):
        """Get a technology by ID"""
        tech = TechnologyService.get_tech(tech_id)
        return self._format_technology(tech)

    def put(self, tech_id):
        """Update a technology"""
        parser = reqparse.RequestParser()
        parser.add_argument('name', type=str)
        parser.add_argument('description', type=str)

        args = parser.parse_args()

        # Filter out None values
        args = {k: v for k, v in args.items() if v is not None}

        TechnologyService.update_tech(tech_id, **args)
        return {'message': 'Technology updated successfully'}, 200

    def delete(self, tech_id):
        """Delete a technology"""
        TechnologyService.delete_tech(tech_id)
        return {'message': 'Technology deleted successfully'}, 200

    def _format_technology(self, tech):
        """Format a single technology for API response"""
        return {
            'id': tech.id,
            'name': tech.name,
            'description': tech.description,
            'tasks': [{'id': task.id, 'name': task.name} for task in tech.tasks]
        }
