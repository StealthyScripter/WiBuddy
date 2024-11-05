from app import db
from app.models import Project
from sqlalchemy.exc import SQLAlchemyError

#Ongoing projects section
class ProjectService:
    @staticmethod
    def get_project(id):
        return Project.query.get(id)

    @staticmethod
    def get_all_project():
         return Project.query.order_by(Project.id).all()

    @staticmethod
    def get_ongoing_projects():
        return Project.query.filter_by(is_completed='False').order_by(Project.id).all()
    
    @staticmethod
    def add_projects():
        return '<p>Adding project logic/function</p>'
        
   
    @staticmethod
    def update_project(id):
        return '<h2><update project logic</h2>'