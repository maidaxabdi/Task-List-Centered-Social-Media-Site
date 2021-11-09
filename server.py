from flask import (Flask, render_template, request, flash, session,
                   redirect, jsonify)
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

    if email == "" or username == "" or password == "":
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
    
@app.route("/add-task", methods=["POST"])
def add_task():
    task = request.get_json().get("task")
    urgency = request.get_json().get("urgency")
    user_id = crud.get_user_id(session['current_user'])
    the_task = crud.create_task(user_id, task = task, urgency = urgency)

    new_task = {
        "task": task, 
        "urgency": urgency,
        "taskId": the_task.task_id,
        "active": the_task.active,
    }

    return jsonify({"addedTask" : new_task})

@app.route("/tasks")
def list_tasks():
    user_id = crud.get_user_id(session['current_user'])
    all_tasks = crud.list_tasks(user_id)
    list_tasks = []
    
    for the_task in all_tasks:
        list_tasks.append({'task' : the_task.task, 'urgency' : the_task.urgency, 'taskId' : the_task.task_id, 'active' : the_task.active})
    return jsonify({"allTasks" : list_tasks})

@app.route("/deactivate-task",  methods=["POST"])
def deactivate_task():
    taskId = request.get_json("props.taskId")
    user_id = crud.get_user_id(session['current_user'])
    the_task = crud.completed_task(taskId, user_id)
    task_completed = {
        "task": the_task.task, 
        "urgency": the_task.urgency,
        "taskId": the_task.task_id,
        "active": the_task.active,
    }
    return jsonify({"completedTask" : task_completed})
    
@app.route("/delete-task",  methods=["POST"])
def delete_task():
    taskId = request.get_json("props.taskId")
    user_id = crud.get_user_id(session['current_user'])
    the_task = crud.get_task(taskId, user_id)
    
    task_deleted = {
        "task": the_task.task, 
        "urgency": the_task.urgency,
        "taskId": the_task.task_id,
        "active": the_task.active,
    }

    crud.delete_task(taskId, user_id)

    return jsonify({"deletedTask" : task_deleted})
  

if __name__ == "__main__":
    connect_to_db(app)
    app.secret_key = 'super secret key'
    app.run(host="0.0.0.0", debug=True)