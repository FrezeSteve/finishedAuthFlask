from flask_restful import Resource, reqparse
from werkzeug.utils import secure_filename
import werkzeug
import os
import string
from random import choice

from .models import Product, User
from . import db, app, TIME_EXP
from flask import request
from flask_restful import abort
import jwt
from functools import wraps
from datetime import datetime, timedelta
from uuid import uuid4
import re

from .models import Anonymous, Token
from werkzeug.security import check_password_hash


def admin_only(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'x-access-token' in request.headers:
            token = request.headers['x-access-token']

        if not token:
            return abort(401, message="Token is missing")
        try:
            data = jwt.decode(token, app.config['SECRET_KEY'])
            # know that the current logged in user is using a token that is in the token table.
            user_obj = User.query.filter_by(public_id=data['public_id']).first()
            if user_obj.token is None and not user_obj.is_admin:
                return abort(401, message="You should login as admin")
        except Exception as e:
            return abort(401, message="Token is invalid, {}".format(e))
        return f(*args, **kwargs)

    return decorated


def auth_any(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'x-access-token' in request.headers:
            token = request.headers['x-access-token']

        if not token:
            return abort(400, message="Only Logged in Users can logout")

        try:
            data = jwt.decode(token, app.config['SECRET_KEY'])
            # know that the current logged in user is using a token that is in the token table.
            user_obj = User.query.filter_by(public_id=data['public_id']).first()
            if user_obj.token is None:
                return abort(401, message="Only Logged in Users can logout")
        except Exception as e:
            return abort(400, message="Something is wrong, {}".format(e))
        return f(user_obj, *args, **kwargs)

    return decorated


class AddProductView(Resource):
    def __init__(self):
        self.parse = reqparse.RequestParser()

    @staticmethod
    def create_new_folder(local_dir):
        newpath = local_dir
        if not os.path.exists(newpath):
            os.makedirs(newpath)
        return newpath

    @staticmethod
    def random_string_generator(size=10, chars=string.ascii_lowercase + string.digits):
        return ''.join(choice(chars) for _ in range(size))

    def post(self):
        token = None
        if 'x-access-token' in request.headers:
            token = request.headers['x-access-token']

        if not token:
            return abort(400, message="Only Logged in Users can add products")

        try:
            data = jwt.decode(token, app.config['SECRET_KEY'])
            # know that the current logged in user is using a token that is in the token table.
            user_obj = User.query.filter_by(public_id=data['public_id']).first()
            if user_obj.token is None or not user_obj.admin:
                raise Exception('Only Logged in admin users can add products')
            self.parse.add_argument('file', type=werkzeug.datastructures.FileStorage, location='files')
            args = self.parse.parse_args()
            image_file = args['file']
            filename = secure_filename(image_file.filename)
            extension = os.path.splitext(filename)[1]
            f_name = self.random_string_generator(size=4) + extension
            self.create_new_folder(app.config['UPLOAD_FOLDER'])
            image_file_path = os.path.join(app.config['UPLOAD_FOLDER'], f_name)

            savetodb = Product(self.random_string_generator(4),
                               330, "ML",
                               self.random_string_generator(size=3, chars=string.digits),
                               "/static/image/" + f_name)

            db.session.add(savetodb)
            db.session.commit()

            image_file.save(image_file_path)
            return {"message": "success"}
        except Exception as e:
            return abort(400, error="{}".format(e))

    @staticmethod
    def get():
        qs = Product.query.all()
        products = []
        product = {}
        for item in qs:
            product['name'] = item.name
            product['bottle_size'] = item.bottle_size
            product['bottle_units'] = item.bottle_units
            product['price'] = item.price
            product['image'] = item.image
            products.append(product)
        return {"products": products}


class AnonymousView(Resource):

    def __init__(self):
        self.parser = reqparse.RequestParser()
        self.time_to_exp = timedelta(hours=1)

    def post(self):
        self.parser.add_argument('session', type=dict, help="session validation")
        args = self.parser.parse_args()
        session = args['session']
        if session is not None:
            session_id, session_token = session.get("session_id", None), session.get("session_token", None)
            if session_id is not None or session_token is not None:
                user_session_id = Anonymous.query.filter_by(session_id=session_id).first()
                user_session_token = Anonymous.query.filter_by(session_token=session_token).first()
                if user_session_token is not None:
                    session_id = user_session_token.session_id
                    session_token = user_session_token.session_token
                    user_session_token.last_login = datetime.utcnow()
                    db.session.add(user_session_token)
                    db.session.commit()
                    return {"session": {"session_id": session_id, "session_token": session_token}}
                elif user_session_id is not None:
                    session_id = user_session_id.session_id
                    session_token = user_session_id.session_token
                    user_session_id.last_login = datetime.utcnow()
                    db.session.add(user_session_id)
                    db.session.commit()
                    return {"session": {"session_id": session_id, "session_token": session_token}}
        time_exp = datetime.utcnow() + self.time_to_exp
        session_id = str(uuid4())
        token = jwt.encode({'session_id': session_id, 'exp': time_exp}, app.config['SECRET_KEY'])
        db.session.add(Anonymous(token.decode('UTF-8'), session_id))
        db.session.commit()
        return {"session": {"session_id": session_id, "session_token": token.decode('UTF-8')}}


class Login(Resource):
    def __init__(self):
        self.parser = reqparse.RequestParser()
        self.time_to_exp = timedelta(hours=24)

    def post(self):
        self.parser.add_argument('login', type=dict, help="login credentials are needed")
        args = self.parser.parse_args()
        login = args['login']
        if login is not None:
            # required fields is email and password
            email = login.get("email", None)
            if email is None or len(email) <= 7:
                return abort(400, error="email is invalid or empty")
            if "@" not in email or "." not in email:
                return abort(400, error="enter a valid email")
            password = login.get("password", None)
            if password is None or len(password) <= 7:
                return abort(400, error="Invalid login credentials")
            qs = User.query.filter_by(email=email).first()
            if qs is None:
                return abort(401, error="Invalid login credentials")
            elif qs is not None:
                if check_password_hash(qs.password, password):
                    time_exp = datetime.utcnow() + self.time_to_exp
                    token = jwt.encode({'public_id': qs.public_id, 'exp': time_exp}, app.config['SECRET_KEY'])
                    # check whether the current user is in the token table
                    qs.last_login = datetime.utcnow()
                    db.session.add(qs)
                    user = qs.token
                    if user is None:
                        # Add the token to the token table
                        db.session.add(Token(token.decode('UTF-8'), qs.id))
                        db.session.commit()
                    else:
                        user.token = token.decode('UTF-8')
                        user.expiration = time_exp
                        db.session.commit()
                    return {'Token': token.decode("UTF-8")}                                                                                                                             
                else:
                    return abort(401, error="Invalid login credentials")
        else:
            return abort(401, error="Invalid login credentials")


class Logout(Resource):
    def post(self):
        token = None
        if 'x-access-token' in request.headers:
            token = request.headers['x-access-token']

        if not token:
            return abort(400, message="Only Logged in Users can logout")

        try:
            data = jwt.decode(token, app.config['SECRET_KEY'])
            # know that the current logged in user is using a token that is in the token table.
            user_obj = User.query.filter_by(public_id=data['public_id']).first()
            if user_obj.token is None:
                return abort(401, message="Only Logged in Users can logout")
            db.session.delete(user_obj.token)
            db.session.commit()
        except Exception as e:
            return abort(400, message="Something is wrong, {}".format(e))
        return {'message': "logged out successfully"}


class SignUp(Resource):
    def __init__(self):
        self.parser = reqparse.RequestParser()

    @staticmethod
    def check_args(args):
        if args['user'] is None:
            abort(404, error="user object is none")
        user = args['user']
        # check whether the various fields have been received
        if user.get('email', None) is None or user.get('username', None) is None:
            abort(400, error="email or username is none")
        elif user.get('password', None) is None:
            abort(400, error="password is none")
        # check whether the various fields have been entered correctly
        # email has to have an @ symbol and a . symbol
        email = user['email']
        if "@" not in email or "." not in email:
            abort(400, error="enter a valid email")
        # password is at least 4 characters long and contains a capital letter and a symbol
        password = user['password']
        if not len(re.findall("[A-Za-z0-9@#$%^&+!=]", password)) >= 8:
            abort(400, error="password must be at least 8 characters long and contains a capital letter and a symbol")
        # username dictionary should be there
        username = user['username']
        if len(username) < 1:
            abort(400, error="enter a valid username")
        # username and email should be unique
        if User.query.filter_by(username=username).first():
            abort(400, error="username already exists")
        elif User.query.filter_by(email=email).first():
            abort(400, error="email already exists")

    def post(self):
        self.parser.add_argument('user', type=dict, help="user is a dictionary object with "
                                                         "required keys ie email, username and password")
        args = self.parser.parse_args()
        self.check_args(args)
        db.session.add(User(args['user']['username'], args['user']['email'], args['user']['password']))
        db.session.commit()
        return {"user": "{username} was successfully added".format(username=args['user']['username'])}
