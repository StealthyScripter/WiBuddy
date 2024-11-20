from app import db
from app.models import Affirmation,Technology
from sqlalchemy.exc import SQLAlchemyError

class TechnologyService:
    @staticmethod
    def get_all_technologies():
        return Technology.query.filter_by().order_by(Technology.id).all()
    
    @staticmethod
    def get_tech(id):
        return Technology.query.get_or_404(id)

    @staticmethod
    def add_tech(name,description="There is no description"):
        tech_to_add = Technology(
            name=name,
            description=description
        )
        try:
            db.session.add(tech_to_add)
            db.session.commit()
            return tech_to_add
        except SQLAlchemyError as e:
            db.session.rollback()
            raise Exception(f'Error adding technology: {str(e)}')

    @staticmethod
    def update_tech(id,name,description="There is no description"):
        tech_to_update = Technology.query.get_or_404(id)
        tech_to_update.name = name if name else tech_to_update.name
        tech_to_update.description = description if description else tech_to_update.description
        
        try:
            db.session.add(tech_to_update)
            db.session.commit()
            return tech_to_update
        except SQLAlchemyError as e:
            db.session.rollback()
            raise Exception(f'Error updating technology: {str(e)}')

    @staticmethod
    def delete_tech(id):
        tech_to_delete = Technology.query.get_or_404(id)
        try:
            db.session.delete(tech_to_delete)
            db.session.commit()
        except SQLAlchemyError as e:
            db.session.rollback()  # Rollback in case of error
            raise Exception(f"Error deleting technology: {str(e)}")
            return e
        

class AffirmationService:
    @staticmethod
    def get_affirmation(id):
        return Affirmation.query.get_or_404(id)

    @staticmethod
    def get_all_affirmations():
        return Affirmation.query.filter_by().order_by(Affirmation.id).all()

    @staticmethod
    def add_affirmation(affirmation,daily_goal):
        new_affirmation = Affirmation(
            affirmation=affirmation
        )
        try:
            db.session.add(new_affirmation)
            db.session.commit()
            return new_affirmation
        except SQLAlchemyError as e:
            db.session.rollback()
            raise Exception(f"Error adding affirmations: {str(e)}")

    @staticmethod
    def update_affirmation(id, entry):
        affirmation_to_update = Affirmation.query.get_or_404(id)
        affirmation_to_update.affirmation = entry if entry else affirmation_to_update.affirmation
        try:
            db.session.add(affirmation_to_update)
            db.session.commit()
            return affirmation_to_update
        except SQLAlchemyError as e:
            db.session.rollback()
            raise Exception(f"Error updating affirmations: {str(e)}")

    @staticmethod
    def delete_affirmation(id):
        affirmation_to_delete = Affirmation.query.get_or_404(id)
        try:
            db.session.delete(affirmation_to_delete)
            db.session.commit()
            return affirmation_to_delete
        except SQLAlchemyError as e:
            db.session.rollback()  # Rollback in case of error
            raise Exception(f"Error deleting affirmation: {str(e)}")
            return e
