from app import app, db
from app.models import *
from tests.populate import populate_data


def init_db():
    db.create_all()
    print("Database initialized successfully")

if __name__ == '__main__':
    init_db()

    

