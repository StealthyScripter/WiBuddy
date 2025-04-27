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
