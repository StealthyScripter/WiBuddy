from app import app, db
from app.models import Technology
from populate import populate_data

with app.app_context():
    db.create_all()  # Create database tables if they don't exist
    
    # Technology Data
    # tech_names = [
    #     "python", "flask", "angular", "c++", "css", "java", "r", "django",
    #     "sql", "figma", "docker", "vue.js", "node.js", "react", "graphql",
    #     "tensorflow", "aws", "azure", "typescript", "next.js"
    # ]
    
    # try:
    #     for tech_name in tech_names:
    #         tech = Technology(name=tech_name)
    #         db.session.add(tech)
    #     db.session.commit()
    # except Exception as e:
    #     db.session.rollback()
    #     print("Error occurred adding technologies:", e)

    # # Call the populate_data function to fill the database with initial data
    # populate_data()

if __name__ == '__main__':
    app.run(debug=True)
