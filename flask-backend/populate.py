# from datetime import datetime
# from app import Task, db, app, Project,Progress,project_technologies,Milestone,Technology,Affirmation

def populate_data():
    # Extended Task Data
    tasks_data = [
        Task(id=1, content="Learn Python basics", completed=True, date="2024-10-01"),
        Task(id=2, content="Build a Flask API", completed=False, date="2024-10-02"),
        Task(id=3, content="Study JavaScript fundamentals", completed=True, date="2024-10-03"),
        Task(id=4, content="Learn advanced JavaScript concepts", completed=False, date=""),
        Task(id=5, content="Refactor existing codebase", completed=True, date="2024-11-01"),
        Task(id=6, content="Deploy application on cloud", completed=False, date="2024-11-03"),
        Task(id=7, content="Handle missing data gracefully", completed=False, date=None),  # Edge case: missing date
        Task(id=8, content="Explore serverless architecture", completed=True, date="2025-01-10"),
        Task(id=9, content="Write unit tests", completed=False, date="2025-02-05"),
        Task(id=10, content="Optimize database queries", completed=True, date="2025-02-12"),
        Task(id=11, content="Work on a collaborative project", completed=False, date="2024-12-31"),
    ]
    db.session.bulk_save_objects(tasks_data)

    # Extended Technology Data
    tech_names = [
        "python", "flask", "angular", "c++", "css", "java", "r", "django",
        "sql", "figma", "docker", "vue.js", "node.js", "react", "graphql",
        "tensorflow", "aws", "azure", "typescript", "next.js"
    ]
    technologies = [Technology(name=tech) for tech in tech_names]
    db.session.bulk_save_objects(technologies)

    # Extended Project Data with Edge Cases
    projects_data = [
        Project(id=1, name='Personal Portfolio', technologies=[technologies[0], technologies[12]]),
        Project(id=2, name='E-commerce Platform', technologies=[technologies[13], technologies[15], technologies[16]]),
        Project(id=3, name='Machine Learning API', technologies=[technologies[0], technologies[16], technologies[14]]),
        Project(id=4, name='Student Management System', technologies=[technologies[1], technologies[2], technologies[3]]),
        Project(id=5, name='Weather Forecasting App', technologies=[technologies[17], technologies[10]]),
        Project(id=6, name='Real-Time Chat Application', technologies=[technologies[6], technologies[13]]),
        Project(id=7, name='Single Page Application', technologies=[technologies[2], technologies[12], technologies[19]]),
        Project(id=8, name='API Integration Demo', technologies=[technologies[8], technologies[15], technologies[18]]),
        Project(id=9, name='Data Science Pipeline', technologies=[technologies[0], technologies[6], technologies[9]]),
        Project(id=10, name='Social Media Platform', technologies=[technologies[13], technologies[19]]),
    ]
    db.session.bulk_save_objects(projects_data)

    # Extended Milestones Data with Variety
    milestones_data = [
        Milestone(description="Initial Setup", project=projects_data[0]),
        Milestone(description="Basic Authentication", project=projects_data[1]),
        Milestone(description="API Endpoints Implemented", project=projects_data[2]),
        Milestone(description="Frontend Layout Design", project=projects_data[3]),
        Milestone(description="Responsive Design Adjustment", project=projects_data[4]),
        Milestone(description="Testing and Debugging", project=projects_data[5]),
        Milestone(description="Continuous Deployment Pipeline", project=projects_data[6]),
        Milestone(description="User Feedback Integration", project=projects_data[7]),
        Milestone(description="Performance Optimization", project=projects_data[8]),
        Milestone(description="Security Enhancements", project=projects_data[9]),
        Milestone(description="Final Deployment", project=projects_data[1]),  # Additional milestone for Project 2
    ]
    db.session.bulk_save_objects(milestones_data)

    # Extended Affirmations Data for Variety
    affirmations_data = [
        Affirmation(id=1, content="Consistency is key to success."),
        Affirmation(id=2, content="Challenge yourself every day to improve."),
        Affirmation(id=3, content="Celebrate every small win."),
        Affirmation(id=4, content="Success is the sum of small efforts."),
        Affirmation(id=5, content="Embrace the journey of learning."),
        Affirmation(id=6, content="Hard work beats talent when talent doesn't work hard."),
        Affirmation(id=7, content="If it scares you, it might be a good thing to try."),
        Affirmation(id=8, content="Mistakes are proof that you are trying."),
        Affirmation(id=9, content="Every line of code is a step toward mastery."),
        Affirmation(id=10, content="Knowledge without action is meaningless."),
        Affirmation(id=11, content="A smooth sea never made a skilled sailor."),
    ]
    db.session.bulk_save_objects(affirmations_data)

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
    db.session.bulk_save_objects(progress_data)

    db.session.commit()

    models = {
        'Task': Task,
        'Project': Project,
        'Progress': Progress,
        'project_technologies': project_technologies,
        'Milestone': Milestone,
        'Technology': Technology,
        'Affirmation': Affirmation
    }


    # with app.app_context():
    #     for name, model in models.items():
    #         count = model.query.count()
    #         print(f"{name}: {count}") 
