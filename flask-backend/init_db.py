from app import app, db
from app.models import *


def init_db():
    with app.app_context():
        db.create_all()
        print("Database initialized successfully")

if __name__ == '__main__':
    init_db()

    

