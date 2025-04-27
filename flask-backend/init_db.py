from app import app, db
from app.models import *

def init_db():
    with app.app_context():
        # Drop all tables first (optional, but helps with clean slate)
        db.drop_all()
        # Create all tables based on the models
        db.create_all()
        print("Database initialized successfully")

        # Optional: Add some initial data for testing
        try:
            # Create sample technologies
            tech1 = Technology(name="Python", description="Programming language")
            tech2 = Technology(name="Flask", description="Web framework")
            db.session.add_all([tech1, tech2])

            # Create sample project
            project = Project(name="Test Project", description="A test project")
            db.session.add(project)

            # Commit to get IDs
            db.session.commit()

            # Create sample task
            task = Task(
                name="Sample Task",
                description="This is a sample task",
                due_date=datetime.utcnow(),
                estimated_duration=2,
                project_id=project.id,
                technology_id=tech1.id
            )
            db.session.add(task)
            db.session.commit()
            print("Sample data added successfully")
        except Exception as e:
            db.session.rollback()
            print(f"Error adding sample data: {str(e)}")

if __name__ == '__main__':
    init_db()
