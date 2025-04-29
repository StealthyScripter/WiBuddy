from flask_restful import Resource
from app.services.utility_service import TechnologyService
from flask import request, g
from app.schemas import TechnologySchema
from marshmallow import ValidationError
from app.resources.auth_resource import token_required

# Create schema instances
technology_schema = TechnologySchema()
technologies_schema = TechnologySchema(many=True)

class TechnologyListResource(Resource):
    @token_required
    def get(self):
        """List all technologies"""
        technologies = TechnologyService.get_all_technologies()
        return technologies_schema.dump(technologies)

    @token_required
    def post(self):
        """Create a new technology"""
        try:
            # Get JSON data
            json_data = request.get_json()
            if not json_data:
                return {"message": "No input data provided"}, 400

            # Validate with schema
            data = technology_schema.load(json_data)

            # Add the technology
            tech = TechnologyService.add_tech(**data)

            return technology_schema.dump(tech), 201

        except ValidationError as err:
            return {"message": "Validation error", "errors": err.messages}, 400
        except Exception as e:
            return {"message": f"Error creating technology: {str(e)}"}, 500

class TechnologyResource(Resource):
    @token_required
    def get(self, tech_id):
        """Get a technology by ID"""
        try:
            tech = TechnologyService.get_tech(tech_id)
            return self._format_technology(tech)
        except Exception as e:
            return {"message": f"Error retrieving technology: {str(e)}"}, 404

    @token_required
    def put(self, tech_id):
        """Update a technology"""
        try:
            # Get JSON data
            json_data = request.get_json()
            if not json_data:
                return {"message": "No input data provided"}, 400

            # Get the existing technology to check if it exists
            existing_tech = TechnologyService.get_tech(tech_id)

            # Partially validate the data
            data = technology_schema.load(json_data, partial=True)

            # Update the technology
            TechnologyService.update_tech(tech_id, **data)

            # Return the updated technology
            updated_tech = TechnologyService.get_tech(tech_id)
            return technology_schema.dump(updated_tech), 200

        except ValidationError as err:
            return {"message": "Validation error", "errors": err.messages}, 400
        except Exception as e:
            return {"message": f"Error updating technology: {str(e)}"}, 500

    @token_required
    def delete(self, tech_id):
        """Delete a technology"""
        try:
            TechnologyService.delete_tech(tech_id)
            return {'message': 'Technology deleted successfully'}, 200
        except Exception as e:
            return {"message": f"Error deleting technology: {str(e)}"}, 500

    def _format_technology(self, tech):
        """Format a single technology for API response with related data"""
        # Start with the basic schema dump
        result = technology_schema.dump(tech)

        # Add related data
        result.update({
            'tasks': [{'id': task.id, 'name': task.name} for task in tech.tasks]
        })

        return result
