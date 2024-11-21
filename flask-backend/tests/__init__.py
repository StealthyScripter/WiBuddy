from app import db, app
from app.models import Task, Project, Technology, Affirmation, Graph
from populate import populate_data

# Initialize the database and populate it with sample data
if __name__ == '__main__':
    with app.app_context():
        db.create_all()  # Ensure tables are created
        populate_data()  # Populate database with sample data
