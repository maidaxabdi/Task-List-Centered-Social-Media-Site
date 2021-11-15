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
        flash('You have successfully logged in!')
        return redirect ('/home')
    elif user and user.password != password:
        flash('Password is incorrect! Please try again.')
    else:
        flash('User with that email does not exist. Please create an account.')
    return redirect ('/')


@app.route("/home")
def visit_home():
    
    return render_template ('mainfeed.html')
        

@app.route("/log-out", methods=["POST"])
def log_out():
    session.pop('current_user')

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
  

@app.route("/create-reward",  methods=["POST"])
def create_reward():
    reward = request.get_json().get("reward")
    user_id = crud.get_user_id(session['current_user'])
    the_reward = crud.create_reward(user_id, reward)
    createdReward = {
        "reward": reward,
        "rewardId": the_reward.reward_id,
    }
    return jsonify({"rewardCreated" : createdReward})


@app.route("/random-reward")
def random_reward():
    user_id = crud.get_user_id(session['current_user'])
    rewardEarned = crud.random_reward(user_id)
    return jsonify({"randomReward" : rewardEarned})


@app.route("/reward")
def list_reward():
    user_id = crud.get_user_id(session['current_user'])
    allRewards = crud.list_rewards(user_id)
    list_rewards = []
    
    for the_reward in allRewards:
        list_rewards.append({'reward' : the_reward.reward, 'rewardId' : the_reward.reward_id})
    
    
    return jsonify({"allRewards" : list_rewards})


@app.route("/delete-reward",  methods=["POST"])
def delete_reward():
    rewardId = request.get_json("props.rewardId")
    user_id = crud.get_user_id(session['current_user'])
    the_reward = crud.get_reward(rewardId, user_id)
    
    reward_deleted = {
        "reward": the_reward.reward, 
        "rewardId": rewardId,
    }

    crud.delete_reward(rewardId, user_id)

    return jsonify({"deletedReward" : reward_deleted})


@app.route("/create-amount",  methods=["POST"])
def create_amount():
    amount = request.get_json().get("amount")
    user_id = crud.get_user_id(session['current_user'])
    crud.set_amount(user_id, amount)
    return jsonify({"amountWantedDone" : amount})


@app.route("/amount")
def reward_when():
    user_id = crud.get_user_id(session['current_user'])
    number = crud.amount_reward(user_id)
    
    return jsonify({"afterCompleted" : number})


@app.route("/completed-tasks")
def number_completed():
    user_id = crud.get_user_id(session['current_user'])
    number = crud.completed_count(user_id)
    
    return jsonify({"completed" : number})


app.route("/create-post")
def new_Post():
    post = request.get_json().get("userPosts")
    user_id = crud.get_user_id(session['current_user'])
    userPost = crud.create_post(user_id, post)
    
    return jsonify({"createPost" : userPost})


if __name__ == "__main__":
    connect_to_db(app)
    app.secret_key = 'super secret key'
    app.run(host="0.0.0.0", debug=True)