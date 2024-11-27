from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_restful import Api

app = Flask(__name__)

CORS(app)

app.config.from_object('app.config.Config')

db = SQLAlchemy(app)

api = Api(app)

from . import routes
