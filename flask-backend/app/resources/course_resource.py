from flask_restful import Resource
from app.services.notes_service import CourseService
from flask import request
from app.schemas import CourseSchema
from marshmallow import ValidationError
from app.resources.auth_resource import token_required

# Create schema instances
course_schema = CourseSchema()
courses_schema = CourseSchema(many=True)

class CourseListResource(Resource):
    @token_required
    def get(self):
        """List all courses with optional filters"""
        user_id = request.args.get('user_id', type=int)
        field = request.args.get('field')

        courses = CourseService.get_all_courses(
            user_id=user_id,
            field=field
        )
        return courses_schema.dump(courses)

    @token_required
    def post(self):
        """Create a new course"""
        try:
            json_data = request.get_json()
            if not json_data:
                return {"message": "No input data provided"}, 400

            # Validate with schema
            data = course_schema.load(json_data)

            # Create the course
            course = CourseService.add_course(**data)

            return course_schema.dump(course), 201

        except ValidationError as err:
            return {"message": "Validation error", "errors": err.messages}, 400
        except Exception as e:
            return {"message": f"Error creating course: {str(e)}"}, 500


class CourseResource(Resource):
    @token_required
    def get(self, course_id):
        """Get a course by ID"""
        try:
            course = CourseService.get_course(course_id)
            return course_schema.dump(course)
        except Exception as e:
            return {"message": f"Error retrieving course: {str(e)}"}, 404

    @token_required
    def put(self, course_id):
        """Update a course"""
        try:
            json_data = request.get_json()
            if not json_data:
                return {"message": "No input data provided"}, 400

            # Validate the data
            data = course_schema.load(json_data, partial=True)

            # Update the course
            updated_course = CourseService.update_course(course_id, **data)

            return course_schema.dump(updated_course), 200

        except ValidationError as err:
            return {"message": "Validation error", "errors": err.messages}, 400
        except Exception as e:
            return {"message": f"Error updating course: {str(e)}"}, 500

    @token_required
    def delete(self, course_id):
        """Delete a course"""
        try:
            CourseService.delete_course(course_id)
            return {'message': 'Course deleted successfully'}, 200
        except Exception as e:
            return {"message": f"Error deleting course: {str(e)}"}, 500


class CourseProgressResource(Resource):
    @token_required
    def put(self, course_id):
        """Recalculate and update course progress"""
        try:
            course = CourseService.update_course_progress(course_id)
            return course_schema.dump(course), 200
        except Exception as e:
            return {"message": f"Error updating course progress: {str(e)}"}, 500
