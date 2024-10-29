from app.models import Task, Project, Progress, Milestone, Technology, Affirmation
from app import db  # Ensure db is also imported to manage session commits

def populate_data():
    # Extended Task Data
    tasks_data = [
        Task(content="Learn Python basics", completed=True, deadline="2024-10-01"),
        Task(content="Build a Flask API", completed=False, deadline="2024-10-02"),
        Task(content="Study JavaScript fundamentals", completed=True, deadline="2024-10-03"),
        Task(content="Learn advanced JavaScript concepts", completed=False, deadline=""),
        Task(content="Refactor existing codebase", completed=True, deadline="2024-11-01"),
        Task(content="Deploy application on cloud", completed=False, deadline="2024-11-03"),
        Task(content="Handle missing data gracefully", completed=False, deadline=None),  # Edge case: missing date
        Task(content="Explore serverless architecture", completed=True, deadline="2025-01-10"),
        Task(content="Write unit tests", completed=False, deadline="2025-02-05"),
        Task(content="Optimize database queries", completed=True, deadline="2025-02-12"),
        Task(content="Work on a collaborative project", completed=False, deadline="2024-12-31"),
    ]

    try:
        for task_info in tasks_data:
            db.session.add(task_info)
        db.session.commit()  # Commit all tasks in one go
    except Exception as e:
        db.session.rollback()
        print("Error occurred adding tasks:", e)

    # Extended Technology Data
    tech_names = [
        "python", "flask", "angular", "c++", "css", "java", "r", "django",
        "sql", "figma", "docker", "vue.js", "node.js", "react", "graphql",
        "tensorflow", "aws", "azure", "typescript", "next.js"
    ]
    
    try:
        for tech_name in tech_names:
            tech = Technology(name=tech_name)
            db.session.add(tech)
        db.session.commit()  # Commit all technologies
    except Exception as e:
        db.session.rollback()
        print("Error occurred adding technologies:", e)

    # Extended Project Data with Edge Cases
    projects_data = [
        Project(name='Personal Portfolio'),
        Project(name='E-commerce Platform'),
        Project(name='Machine Learning API'),
        Project(name='Student Management System'),
        Project(name='Weather Forecasting App'),
        Project(name='Real-Time Chat Application'),
        Project(name='Single Page Application'),
        Project(name='API Integration Demo'),
        Project(name='Data Science Pipeline'),
        Project(name='Social Media Platform'),
    ]
    
    try:
        for project in projects_data:
            db.session.add(project)
        db.session.commit()  # Commit all projects
    except Exception as e:
        db.session.rollback()
        print("Error occurred adding projects:", e)

    # Add technologies to projects (assuming technology entries exist)
    try:
        personal_portfolio = Project.query.filter_by(name='Personal Portfolio').first()
        python_tech = Technology.query.filter_by(name='python').first()
        react_tech = Technology.query.filter_by(name='react').first()
        
        if personal_portfolio and python_tech and react_tech:
            personal_portfolio.technologies.extend([python_tech, react_tech])
            db.session.commit()
    except Exception as e:
        db.session.rollback()
        print("Error occurred linking technologies to projects:", e)

    # Extended Milestones Data with Variety
    milestones_data = [
        Milestone(description="Initial Setup", project_id=1),
        Milestone(description="Basic Authentication", project_id=1),
        Milestone(description="API Endpoints Implemented", project_id=1),
        Milestone(description="Frontend Layout Design", project_id=1),
        Milestone(description="Responsive Design Adjustment", project_id=1),
        Milestone(description="Testing and Debugging", project_id=1),
        Milestone(description="Continuous Deployment Pipeline", project_id=1),
        Milestone(description="User Feedback Integration", project_id=1),
        Milestone(description="Performance Optimization", project_id=1),
        Milestone(description="Security Enhancements", project_id=1),
        Milestone(description="Final Deployment", project_id=1),
    ]

    try:
        for milestone_info in milestones_data:
            db.session.add(milestone_info)
        db.session.commit()  # Commit all milestones
    except Exception as e:
        db.session.rollback()
        print("Error occurred adding milestones:", e)

    # Extended Affirmations Data for Variety
    affirmations_data = [
        Affirmation(content="Consistency is key to success."),
        Affirmation(content="Challenge yourself every day to improve."),
        Affirmation(content="Celebrate every small win."),
        Affirmation(content="Success is the sum of small efforts."),
        Affirmation(content="Embrace the journey of learning."),
        Affirmation(content="Hard work beats talent when talent doesn't work hard."),
        Affirmation(content="If it scares you, it might be a good thing to try."),
        Affirmation(content="Mistakes are proof that you are trying."),
        Affirmation(content="Every line of code is a step toward mastery."),
        Affirmation(content="Knowledge without action is meaningless."),
        Affirmation(content="A smooth sea never made a skilled sailor."),
    ]

    try:
        for affirmation_info in affirmations_data:
            db.session.add(affirmation_info)
        db.session.commit()  # Commit all affirmations
    except Exception as e:
        db.session.rollback()
        print("Error occurred adding affirmations:", e)

    # Extended Progress Data with Edge Cases
    progress_data = [
        Progress(language="Python", completed=15, total=25, date_started="2024-10-12"),
        Progress(language="JavaScript", completed=10, total=20, date_started="2024-10-14"),
        Progress(language="Angular", completed=0, total=15, date_started="2024-10-18"),  # Edge case: No progress
        Progress(language="React", completed=18, total=18, date_started="2024-10-10"),  # Edge case: Completed progress
        Progress(language="Flask", completed=6, total=10, date_started="2024-09-15"),
        Progress(language="GraphQL", completed=5, total=9, date_started="2024-09-25"),
        Progress(language="TensorFlow", completed=4, total=8, date_started="2024-08-22"),
        Progress(language="AWS", completed=3, total=7, date_started="2024-08-30"),
        Progress(language="Azure", completed=0, total=6, date_started="2024-10-01"),  # Edge case: No progress
        Progress(language="Next.js", completed=12, total=12, date_started="2024-10-20"),  # Edge case: Fully completed
        Progress(language="Docker", completed=2, total=10, date_started="2024-07-15"),  # Low progress relative to total
    ]

    try:
        for progress_info in progress_data:
            db.session.add(progress_info)
        db.session.commit()  # Commit all progress data
    except Exception as e:
        db.session.rollback()
        print("Error occurred adding progress:", e)

    try:
        db.session.commit()
        print("Data populated successfully")
    except Exception as e:
        db.session.rollback()
        print("Error committing data:", e)
