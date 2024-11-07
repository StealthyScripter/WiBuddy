from app import db
from app.models import Project
from sqlalchemy.exc import SQLAlchemyError
from datetime import datetime

#Ongoing projects section
class ProjectService:
    @staticmethod
    def get_project(id):
        return Project.query.get_or_404(id)

    @staticmethod
    def get_all_projects():
         return Project.query.order_by(Project.id).all()

    @staticmethod
    def get_ongoing_projects():
        return Project.query.filter_by(is_completed='False').order_by(Project.id).all()
    
    @staticmethod
    def add_project(name,description=None,due_date=None, is_completed=False,completion_date=None):
        
            due_date = datetime.strptime(due_date, '%Y-%m-%d') if due_date else None

            new_project = Project(
                name=name,
                description=description,
                date_created=datetime.utcnow(),
                due_date=due_date,
                completion_date=completion_date,
                is_completed=is_completed,
                
            )
            try:
                db.session.add(new_project)
                db.session.commit()
                return new_project
            except SQLAlchemyError as e:
                db.session.rollback()  # Rollback in case of error
                raise Exception(f"Error adding task: {str(e)}")
        
   
    @staticmethod
    def update_project(id, name=None, description=None, due_date=None, is_completed=None):
        project_to_update = ProjectService.get_project(id)
    
        # Assign the new values if provided, otherwise keep the current ones
        project_to_update.name = name if name else project_to_update.name
        project_to_update.description = description if description else project_to_update.description
        project_to_update.due_date = datetime.strptime(due_date, '%Y-%m-%d') if due_date else project_to_update.due_date
        project_to_update.is_completed = is_completed if is_completed is not None else project_to_update.is_completed

        if project_to_update.is_completed:
            project_to_update.completion_date = datetime.utcnow()
        else:
            project_to_update.completion_date = None  # Reset if not completed

        try:
            db.session.commit()
            return project_to_update
        except SQLAlchemyError as e:
            db.session.rollback()  # Rollback in case of error
            raise Exception(f"Error adding task: {str(e)}")
    
    
    @staticmethod
    def complete_project(id):
        current_project = Project.query.get_or_404(id)
        current_project.is_completed = True
        try:
            db.session.commit()
            return current_project
        except:
            db.session.rollback()
            return "Unable to mark your task complete"
    
    @staticmethod
    def delete_project(project_id):
        project_to_delete = Project.query.get_or_404(project_id)
        try:
            db.session.delete(project_to_delete)
            db.session.commit()
            return "<h4>Project deleted</h4>"
        except SQLAlchemyError as e:
            db.session.rollback()  # Rollback in case of error
            raise Exception(f"Error deleting task: {str(e)}")
            return e
    