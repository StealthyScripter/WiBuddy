from flask import Flask
from flask_sqlalchemy import SQLAlchemy


app = Flask(__name__)
app.config.from_object('app.config.Config')

db = SQLAlchemy(app)

def create_app():
    return app

if __name__ == '__main__':
    app.run(debug=True)
