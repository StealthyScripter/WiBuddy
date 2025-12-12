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
                project_id=project.id
            )
            # Add technology using the many-to-many relationship
            task.technologies.append(tech1)
            db.session.add(task)
            db.session.commit()

            # Create sample LMS data
            # Create a folder
            folder = Folder(
                name="Computer Science",
                description="CS learning materials",
                user_id=admin_user.id,
                color="#4CAF50"
            )
            db.session.add(folder)
            db.session.commit()

            # Create a course
            course = Course(
                name="Introduction to Web Development",
                code="CS101",
                description="Learn the basics of web development",
                field="TECHNOLOGY",
                instructor="Dr. Smith",
                semester="Fall 2024",
                credits=3,
                user_id=admin_user.id,
                color="#2196F3"
            )
            db.session.add(course)
            db.session.commit()

            # Create modules for the course
            module1 = Module(
                course_id=course.id,
                name="HTML Basics",
                description="Learn HTML fundamentals",
                order=1,
                learning_objectives=["Understand HTML structure", "Create basic web pages"],
                estimated_hours=10
            )
            module2 = Module(
                course_id=course.id,
                name="CSS Styling",
                description="Learn CSS for styling",
                order=2,
                learning_objectives=["Style web pages", "Use CSS selectors"],
                estimated_hours=15
            )
            db.session.add_all([module1, module2])
            db.session.commit()

            # Create notes
            note1 = Note(
                name="HTML Tags Reference",
                content=["<html>", "<body>", "<h1>", "<p>"],
                type="list",
                tags=["html", "reference"],
                user_id=admin_user.id,
                folder_id=folder.id,
                module_id=module1.id,
                ai_summary="Quick reference for common HTML tags"
            )
            note2 = Note(
                name="CSS Box Model",
                content=["The CSS box model consists of:", "- Content", "- Padding", "- Border", "- Margin"],
                type="text",
                tags=["css", "concepts"],
                user_id=admin_user.id,
                module_id=module2.id,
                ai_summary="Understanding the CSS box model"
            )
            db.session.add_all([note1, note2])
            db.session.commit()

            print("Sample data added successfully")
            print("\nSample LMS data created:")
            print(f"- Folder: {folder.name}")
            print(f"- Course: {course.name}")
            print(f"- Modules: {module1.name}, {module2.name}")
            print(f"- Notes: {note1.name}, {note2.name}")

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
