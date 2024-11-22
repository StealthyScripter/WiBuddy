from flask import Flask
from flask_sqlalchemy import SQLAlchemy


app = Flask(__name__)
app.config.from_object('app.config.Config')

db = SQLAlchemy(app)

from . import routes

if __name__ == '__main__':
    app.run(debug=True)
