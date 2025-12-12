from flask_restful import Resource
from app.services.notes_service import ModuleService
from flask import request
from app.schemas import ModuleSchema
from marshmallow import ValidationError
from app.resources.auth_resource import token_required

# Create schema instances
module_schema = ModuleSchema()
modules_schema = ModuleSchema(many=True)

class ModuleListResource(Resource):
    @token_required
    def get(self):
        """List all modules with optional course filter"""
        course_id = request.args.get('course_id', type=int)

        modules = ModuleService.get_all_modules(course_id=course_id)
        return modules_schema.dump(modules)

    @token_required
    def post(self):
        """Create a new module"""
        try:
            json_data = request.get_json()
            if not json_data:
                return {"message": "No input data provided"}, 400

            # Validate with schema
            data = module_schema.load(json_data)

            # Create the module
            module = ModuleService.add_module(**data)

            return module_schema.dump(module), 201

        except ValidationError as err:
            return {"message": "Validation error", "errors": err.messages}, 400
        except Exception as e:
            return {"message": f"Error creating module: {str(e)}"}, 500


class ModuleResource(Resource):
    @token_required
    def get(self, module_id):
        """Get a module by ID"""
        try:
            module = ModuleService.get_module(module_id)
            return module_schema.dump(module)
        except Exception as e:
            return {"message": f"Error retrieving module: {str(e)}"}, 404

    @token_required
    def put(self, module_id):
        """Update a module"""
        try:
            json_data = request.get_json()
            if not json_data:
                return {"message": "No input data provided"}, 400

            # Validate the data
            data = module_schema.load(json_data, partial=True)

            # Update the module
            updated_module = ModuleService.update_module(module_id, **data)

            return module_schema.dump(updated_module), 200

        except ValidationError as err:
            return {"message": "Validation error", "errors": err.messages}, 400
        except Exception as e:
            return {"message": f"Error updating module: {str(e)}"}, 500

    @token_required
    def delete(self, module_id):
        """Delete a module"""
        try:
            ModuleService.delete_module(module_id)
            return {'message': 'Module deleted successfully'}, 200
        except Exception as e:
            return {"message": f"Error deleting module: {str(e)}"}, 500
