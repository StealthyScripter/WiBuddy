from marshmallow import Schema, fields, validate, ValidationError
from datetime import datetime

class TaskSchema(Schema):
    id = fields.Int(dump_only=True)
    name = fields.Str(required=True, validate=validate.Length(min=1, max=200))
    description = fields.Str(allow_none=True)
    is_completed = fields.Bool(default=False)
    date_created = fields.DateTime(dump_only=True)
    due_date = fields.Date(allow_none=True)
    estimated_duration = fields.Int(validate=validate.Range(min=1, max=168), default=4)  # Max 1 week in hours
    completion_date = fields.DateTime(dump_only=True)
    is_milestone = fields.Bool(default=False)
    project_id = fields.Int(allow_none=True)
    technology_id = fields.Int(allow_none=True)
    hierarchy = fields.Int(default=1, validate=validate.Range(min=1, max=10))

    # Custom validation
    def validate_due_date(self, due_date):
        if due_date and due_date < datetime.today().date():
            raise ValidationError("Due date cannot be in the past")

class ProjectSchema(Schema):
    id = fields.Int(dump_only=True)
    name = fields.Str(required=True, validate=validate.Length(min=1, max=200))
    description = fields.Str(allow_none=True)
    date_created = fields.DateTime(dump_only=True)
    due_date = fields.Date(allow_none=True)
    completion_date = fields.DateTime(dump_only=True)
    is_completed = fields.Bool(default=False)

class TechnologySchema(Schema):
    id = fields.Int(dump_only=True)
    name = fields.Str(required=True, validate=validate.Length(min=1, max=50))
    description = fields.Str(allow_none=True)

class AffirmationSchema(Schema):
    id = fields.Int(dump_only=True)
    affirmation = fields.Str(required=True, validate=validate.Length(min=1, max=500))
    daily_goals = fields.Str(allow_none=True, validate=validate.Length(max=501))

# User schemas for authentication
class UserSchema(Schema):
    id = fields.Int(dump_only=True)
    username = fields.Str(required=True, validate=validate.Length(min=3, max=50))
    email = fields.Email(required=True)
    password = fields.Str(required=True, load_only=True, validate=validate.Length(min=8))
    is_admin = fields.Bool(default=False)
    date_joined = fields.DateTime(dump_only=True)

class UserLoginSchema(Schema):
    username = fields.Str(required=True)
    password = fields.Str(required=True, load_only=True)

# LMS Schemas
class FolderSchema(Schema):
    id = fields.Int(dump_only=True)
    name = fields.Str(required=True, validate=validate.Length(min=1, max=200))
    description = fields.Str(allow_none=True)
    parent_id = fields.Int(allow_none=True)
    user_id = fields.Int(allow_none=True)
    date_created = fields.DateTime(dump_only=True)
    last_modified = fields.DateTime(dump_only=True)
    color = fields.Str(allow_none=True, validate=validate.Length(max=50))

class CourseSchema(Schema):
    id = fields.Int(dump_only=True)
    name = fields.Str(required=True, validate=validate.Length(min=1, max=200))
    code = fields.Str(allow_none=True, validate=validate.Length(max=50))
    description = fields.Str(allow_none=True)
    field = fields.Str(allow_none=True)
    instructor = fields.Str(allow_none=True, validate=validate.Length(max=100))
    semester = fields.Str(allow_none=True, validate=validate.Length(max=50))
    credits = fields.Int(allow_none=True, validate=validate.Range(min=0, max=20))
    start_date = fields.DateTime(allow_none=True)
    end_date = fields.DateTime(allow_none=True)
    progress = fields.Float(allow_none=True, validate=validate.Range(min=0, max=100))
    color = fields.Str(allow_none=True, validate=validate.Length(max=50))
    tags = fields.List(fields.Str(), allow_none=True)
    user_id = fields.Int(allow_none=True)
    date_created = fields.DateTime(dump_only=True)
    last_modified = fields.DateTime(dump_only=True)

class ModuleSchema(Schema):
    id = fields.Int(dump_only=True)
    course_id = fields.Int(required=True)
    name = fields.Str(required=True, validate=validate.Length(min=1, max=200))
    description = fields.Str(allow_none=True)
    order = fields.Int(default=0)
    learning_objectives = fields.List(fields.Str(), allow_none=True)
    progress = fields.Float(default=0.0, validate=validate.Range(min=0, max=100))
    estimated_hours = fields.Int(allow_none=True, validate=validate.Range(min=0))
    completed_hours = fields.Int(default=0, validate=validate.Range(min=0))
    due_date = fields.DateTime(allow_none=True)
    date_created = fields.DateTime(dump_only=True)
    last_modified = fields.DateTime(dump_only=True)

class NoteSchema(Schema):
    id = fields.Int(dump_only=True)
    name = fields.Str(required=True, validate=validate.Length(min=1, max=200))
    content = fields.List(fields.Str(), allow_none=True)
    date_created = fields.DateTime(dump_only=True)
    last_modified = fields.DateTime(dump_only=True)
    type = fields.Str(allow_none=True)
    image_url = fields.Str(allow_none=True, validate=validate.Length(max=500))
    images = fields.List(fields.Dict(), allow_none=True)
    tags = fields.List(fields.Str(), allow_none=True)
    items = fields.List(fields.Str(), allow_none=True)
    ai_summary = fields.Str(allow_none=True)
    user_id = fields.Int(allow_none=True)
    folder_id = fields.Int(allow_none=True)
    module_id = fields.Int(allow_none=True)
