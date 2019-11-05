from flask import Flask
from flask_restful import Api
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from datetime import timedelta
import os

app = Flask(__name__)
CORS(app)
api = Api(app)

base_folder = os.path.split(os.path.abspath(__file__))[0]

app.config['SECRET_KEY'] = 'secret'
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://ste:testpass@localhost/testfla'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['UPLOAD_FOLDER'] = os.path.join(base_folder, 'static/image')

db = SQLAlchemy(app)
migrate = Migrate(app, db)

TIME_EXP = timedelta(hours=24)

from .views import AddProductView, AnonymousView, Login, Logout, SignUp

api.add_resource(AddProductView, '/product')
api.add_resource(AnonymousView, '/session')
api.add_resource(Login, '/login')
api.add_resource(Logout, '/logout')
api.add_resource(SignUp, '/signup')
