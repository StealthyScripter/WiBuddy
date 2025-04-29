from app import app, db
from app.models import *
from werkzeug.security import generate_password_hash

def init_db():
    with app.app_context():
        # Drop all tables first (optional, but helps with clean slate)
        db.drop_all()
        # Create all tables based on the models
        db.create_all()
        print("Database initialized successfully")

        # Add some initial data for testing(optional)
        try:
            # Create admin user
            admin_user = User(
                username="admin",
                email="admin@example.com",
                password_hash=generate_password_hash("AdminPassword123!"),
                is_admin=True
            )
            db.session.add(admin_user)

            # Create regular user
            regular_user = User(
                username="user",
                email="user@example.com",
                password_hash=generate_password_hash("UserPassword123!"),
                is_admin=False
            )
            db.session.add(regular_user)

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

            print(f"\nDefault Admin User Created:")
            print(f"Username: admin")
            print(f"Password: AdminPassword123!")
            print(f"\nDefault Regular User Created:")
            print(f"Username: user")
            print(f"Password: UserPassword123!")
        except Exception as e:
            db.session.rollback()
            print(f"Error adding sample data: {str(e)}")

if __name__ == '__main__':
    init_db()
