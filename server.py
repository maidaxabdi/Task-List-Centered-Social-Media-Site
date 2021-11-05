from flask import (Flask, render_template, request, flash, session,
                   redirect)
from model import connect_to_db
import crud
from jinja2 import StrictUndefined
from datetime import datetime

app = Flask(__name__)
app.secret_key = 'super secret key'
app.jinja_env.undefined = StrictUndefined


app = Flask(__name__)


@app.route('/')
def homepage():
    """View homepage."""

    return render_template('homepage.html')


@app.route('/users', methods=['POST'])
def next_steps():
    username = request.form.get("username")
    email = request.form.get("email")
    password = request.form.get("password")
    
    email_exists = crud.get_user_by_email(email)
    username_exists = crud.get_user_by_username(username)

    if email is "" or username is "" or password is "":
        flash("Please enter in the required fields.")
    elif email_exists:
        flash("That email is already in use. Please sign in.")
    elif username_exists:
        flash("That username is already in use. Please pick a different username.")
    elif len(password) < 10:
        flash("That password is too short. Please pick a longer password.") 
    else:
        date_account_created = datetime.now().replace(second=0, microsecond=0)
        crud.create_user(email, password, username, date_account_created)
        flash("Account created! Please log in.")
    return redirect ('/')


@app.route("/login", methods=["POST"])
def current_user():
    email = request.form.get("email")
    password = request.form.get("password")
    user = crud.get_user_by_email(email)

    if user and user.password == password:
        session['current_user'] = user.email
        return render_template ('mainfeed.html')
    elif user and user.password != password:
        flash('Password is incorrect! Please try again.')
    else:
        flash('User with that email does not exist. Please create an account.')

    return redirect ('/')
    

if __name__ == "__main__":
    connect_to_db(app)
    app.secret_key = 'super secret key'
    app.run(host="0.0.0.0", debug=True)