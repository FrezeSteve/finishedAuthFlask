"""Create a new admin user able to view the /reports endpoint."""
from getpass import getpass
import sys

from mysite import app, db
from mysite.models import User


def main():
    """Main entry point for script."""
    with app.app_context():
        if User.query.all():
            print('A user already exists! Create another? (y/n):',)
            create = input()
            if create == 'n':
                return

        print('Enter username address:', )
        username = input()
        print('Enter email address:', )
        email = input()
        print('Enter password: ', )
        password = getpass()
        assert password == getpass('Password (again):')

        user = User(
            username=username,
            email=email,
            password=password)
        user.admin = True
        db.session.add(user)
        db.session.commit()
        print('User added.')


if __name__ == '__main__':
    sys.exit(main())
