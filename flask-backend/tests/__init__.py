from app import db,app
from app.models import Task, Project, Technology, Affirmation, Graph  # Import your models
from datetime import datetime, timedelta

def populate_database():
    # Sample technologies
    tech1 = Technology(name="Python", description="A high-level programming language.")
    tech2 = Technology(name="JavaScript", description="A versatile programming language for web development.")
    tech3 = Technology(name="SQL", description="Language for managing and querying databases.")
    
    db.session.add(tech1)
    db.session.add(tech2)
    db.session.add(tech3)

    # Sample projects
    project1 = Project(name="Website Development", description="Develop a responsive website.", date_created=datetime.utcnow(), due_date=datetime.utcnow() + timedelta(days=30))
    project2 = Project(name="Data Analysis", description="Analyze data from various sources.", date_created=datetime.utcnow(), due_date=datetime.utcnow() + timedelta(days=60))
    
    db.session.add(project1)
    db.session.add(project2)

    # Sample tasks
    task1 = Task(name="Setup Flask", description="Initialize a Flask project.", is_completed=False, project_id=1, technology_id=1)
    task2 = Task(name="Create Database Models", description="Define database models using SQLAlchemy.", is_completed=False, project_id=1, technology_id=1)
    task3 = Task(name="Develop Frontend", description="Create the frontend using Angular.", is_completed=False, project_id=1, technology_id=2)
    task4 = Task(name="Analyze Data", description="Perform exploratory data analysis.", is_completed=False, project_id=2, technology_id=3)
    
    db.session.add(task1)
    db.session.add(task2)
    db.session.add(task3)
    db.session.add(task4)

    # Adding prerequisites
    task1.prerequisites.append(task2)  # task2 is a prerequisite for task1
    task2.prerequisites.append(task3)  # task3 is a prerequisite for task2

    # Sample affirmations
    affirmation1 = Affirmation(affirmation="I am capable of achieving my goals.", daily_goals="Complete one task today.")
    affirmation2 = Affirmation(affirmation="I will stay focused and productive.", daily_goals="Spend at least one hour coding.")
    
    db.session.add(affirmation1)
    db.session.add(affirmation2)

    # Sample graphs
    graph1 = Graph(title="Task Completion Overview", type="bar", data_source=1)
    graph2 = Graph(title="Project Timeline", type="line", data_source=2)
    
    db.session.add(graph1)
    db.session.add(graph2)

    # Commit all changes to the database
    db.session.commit()
    print("Database populated successfully!")

# Call the populate function
if __name__ == '__main__':
    with app.app_context():
        db.create_all()  # Ensure the tables are created
        populate_database()
