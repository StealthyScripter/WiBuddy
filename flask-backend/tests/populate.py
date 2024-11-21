from app.models import Task, Project, Technology, Affirmation
from app import db

def populate_data():
    tech_names = [
        "python", "flask", "angular", "c++", "css", "java", "r", "django",
        "sql", "figma", "docker", "vue.js", "node.js", "react", "graphql",
        "tensorflow", "aws", "azure", "typescript", "next.js"
    ]
    try:
        for tech_name in tech_names:
            tech = Technology(name=tech_name)
            db.session.add(tech)
        db.session.commit()
        print("Technologies loaded successfully")
    except Exception as e:
        db.session.rollback()
        print("Error adding technologies:", str(e))

    projects_data = [
        'Personal Portfolio', 'E-commerce Platform', 'Machine Learning API',
        'Student Management System', 'Weather Forecasting App',
        'Real-Time Chat Application', 'Single Page Application',
        'API Integration Demo', 'Data Science Pipeline', 'Social Media Platform',
    ]
    try:
        for project_name in projects_data:
            project = Project(name=project_name)
            db.session.add(project)
        db.session.commit()
        print("Projects loaded successfully")
    except Exception as e:
        db.session.rollback()
        print("Error adding projects:", str(e))

    tasks_data = [
        {"name": "Learn Python basics", "is_completed": True, "due_date": "2024-10-01"},
        {"name": "Build a Flask API", "is_completed": False, "due_date": "2024-10-02"},
        # Add more tasks as needed
    ]
    try:
        for task_info in tasks_data:
            task = Task(
                name=task_info["name"],
                is_completed=task_info["is_completed"],
                due_date=task_info["due_date"]
            )
            db.session.add(task)
        db.session.commit()
        print("Tasks loaded successfully")
    except Exception as e:
        db.session.rollback()
        print("Error adding tasks:", str(e))

    affirmations_data = [
        "Embrace the Journey: As a computer science major...",
        "Innovate and Inspire...",
        "Collaboration and Community...",
        "Adapt and Thrive...",
        "Your Future is Bright..."
    ]
    try:
        for affirmation_text in affirmations_data:
            affirmation = Affirmation(affirmation=affirmation_text)
            db.session.add(affirmation)
        db.session.commit()
        print("Affirmations loaded successfully")
    except Exception as e:
        db.session.rollback()
        print("Error adding affirmations:", str(e))
