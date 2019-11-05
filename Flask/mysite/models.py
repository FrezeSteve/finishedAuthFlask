# Models
from . import db, TIME_EXP
from sqlalchemy import Column, Integer, DateTime, String, ForeignKey, Boolean, Enum
from sqlalchemy.orm import relationship
from werkzeug.security import generate_password_hash
from datetime import datetime
from uuid import uuid4

BOTTLEUNITS = {
    "ML": 'ml',
    "LTR": 'ltr'
}


# Accounts
class Anonymous(db.Model):
    id = Column(Integer, primary_key=True)
    session_id = Column(String(500), unique=True, index=True, nullable=False)
    session_token = Column(String(500), unique=True)
    create_date = Column(DateTime(), default=datetime.utcnow)
    last_login = Column(DateTime(), default=datetime.utcnow, nullable=False)

    def __init__(self, token, session_id):
        self.session_token = token
        self.session_id = session_id

    def __repr__(self):
        return f"<Anonymous '{self.session_id}'>"


class User(db.Model):
    id = Column(Integer, primary_key=True)
    public_id = Column(String(500), unique=True, index=True, nullable=False)
    username = Column(String(120), unique=True, index=True, nullable=False)
    password = Column(String(120), unique=True, nullable=False)
    email = Column(String(120), unique=True, index=True, nullable=False)

    admin = Column(Boolean, nullable=False, default=False)
    active = Column(Boolean, nullable=False, default=True)
    authenticated = Column(Boolean, nullable=False, default=True)

    created_at = Column(DateTime(), default=datetime.utcnow)
    last_login = Column(DateTime(), default=datetime.utcnow)

    token = relationship('Token', uselist=False, backref="auth")

    def __init__(self, username, email, password):
        self.public_id = str(uuid4())
        self.username = username
        self.email = email
        self.password = generate_password_hash(password)

    def __repr__(self):
        return f"User<'{self.username}'>"


class Token(db.Model):
    id = Column(Integer, primary_key=True)
    # public_token_id = Column(String(500), unique=True, index=True, nullable=False)
    token = Column(String(500), unique=True, index=True, nullable=False)
    expiration = Column(DateTime(), default=datetime.utcnow)
    user = Column(Integer, ForeignKey('user.id'), nullable=False)

    def __init__(self, token, user_id):
        self.token = token
        self.expiration = datetime.utcnow() + TIME_EXP
        self.user = user_id

    def __repr__(self):
        return f"<Token '{self.user}'>"


# Product
class Product(db.Model):
    id = Column(Integer, primary_key=True)
    name = Column(String(120), index=True, nullable=False)
    bottle_size = Column(Integer, default=330, nullable=False)
    bottle_units = Column(Enum(*BOTTLEUNITS, name='units1'), default=BOTTLEUNITS['ML'], nullable=False)
    price = Column(Integer, default=100, nullable=False)
    image = Column(String(120))

    def __init__(self, name, bottle_size, bottle_units, price, image):
        self.name = name
        self.bottle_size = bottle_size
        self.bottle_units = bottle_units
        self.price = price
        self.image = image

    def __repr__(self): return self.name
