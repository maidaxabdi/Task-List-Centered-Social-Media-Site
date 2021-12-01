from flask import (Flask, render_template, request, flash, session,
                   redirect, jsonify)
from model import connect_to_db
import crud
from jinja2 import StrictUndefined
from datetime import datetime
import os
import cloudinary.uploader

CLOUDINARY_KEY = os.environ['CLOUDINARY_KEY']
CLOUDINARY_SECRET = os.environ['CLOUDINARY_SECRET']
CLOUD_NAME = "check"


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
    
    return render_template ('base.html')
        

@app.route("/log-out", methods=['POST'])
def log_out():
    session.pop('current_user')
    return redirect ('/')


@app.route("/add-task", methods=["POST"])
def add_task():
    task = request.get_json().get("task")
    user_id = crud.get_user_id(session['current_user'])
    the_task = crud.create_task(user_id, task = task)

    new_task = {
        "task": task, 
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


@app.route("/new-post",  methods=["POST"])
def new_post():
    post = request.get_json().get("post")
    post_title = request.get_json().get("postTitle")
    user_id = crud.get_user_id(session['current_user'])
    post_date_made = datetime.now().replace(second=0, microsecond=0)
    the_post = crud.create_post(user_id, post, post_date_made, post_title)
    
    posts = crud.get_post(user_id, postId = the_post.post_id)
    thePost = {
        "post": post,
        "postTitle": post_title,
        "postId": posts[0][1].post_id,
        "profilePic": posts[0][0].profile_picture,
        "username": posts[0][0].username,
        "name": posts[0][0].name,
    }

    return jsonify({"createdPost" : thePost})


@app.route("/delete-post",  methods=["POST"])
def delete_post():
    postId = request.get_json("props.postId")
    user_id = crud.get_user_id(session['current_user'])
    the_post = crud.get_post(postId, user_id)
    
    post_deleted = {
        "post": the_post.post, 
        "postTitle": the_post.post_title,
        "postId": the_post.post_id,
    }

    crud.delete_post(postId, user_id)

    return jsonify({"deletedPost" : post_deleted})


@app.route("/posts")
def list_posts():
    user_id = crud.get_user_id(session['current_user'])
    allPosts = crud.list_posts(user_id)
    list_posts = []
    
    for i in range(len(allPosts)):
        list_posts.append({
            'username': allPosts[i][0].username, 
            'name': allPosts[i][0].name, 
            'profilePic': allPosts[i][0].profile_picture, 
            'post': allPosts[i][1].post, 
            'postTitle' : allPosts[i][1].post_title, 
            'postId' : allPosts[i][1].post_id, 
            'postDate': allPosts[i][1].post_date_made})

    return jsonify({"allPosts" : list_posts})


@app.route("/edit-pic",  methods=["POST"])
def edit_profile():
    user_id = crud.get_user_id(session['current_user'])
    user = crud.get_user(user_id)
    profile_picture = request.files['my-file']

    if profile_picture != user.bio:
        result = cloudinary.uploader.upload(profile_picture,
            api_key=CLOUDINARY_KEY,
            api_secret=CLOUDINARY_SECRET,
            cloud_name=CLOUD_NAME),
        print(result[0]['secure_url'])
        img_url = result[0]['secure_url']
    
    profile_picture = img_url
    username = user.username
    name = user.name
    bio = user.bio

    crud.edit_profile(user_id, profile_picture, username, name, bio)
    user_edited = {
        "userId": user_id,
        "profilePic": img_url,
        "name": name,
        "bio": bio,
        "username": username,
    }

    return jsonify({"editedProfile" : user_edited})


@app.route("/edit-user",  methods=["POST"])
def edit_user():
    user_id = crud.get_user_id(session['current_user'])
    name = request.get_json().get("usersName")
    username = request.get_json().get("username")
    bio = request.get_json().get("userBio")

    user = crud.get_user(user_id)
    profile_picture = user.profile_picture

    crud.edit_profile(user_id, profile_picture, username, name, bio)
    
    user_edited = {
        "userId": user_id,
        "name": name,
        "bio": bio,
        "username": username,
    }

    return jsonify({"editedProfile" : user_edited})


@app.route('/user-info')
def show_user():
    get_user = crud.get_user_by_email(session['current_user'])
    get_info = {
        "userId": get_user.user_id,
        "name": get_user.name,
        "username": get_user.username,
        "profilePic": get_user.profile_picture,
        "bio": get_user.bio,
    }

    return jsonify({"userInfo" : get_info})


@app.route('/search',  methods=["POST"])
def show_search(): 
    search = request.get_json().get("search")
    session['search'] = search
    the_search = crud.search_site(search)

    all_results = []
    users = []
    posts = []
    if the_search[0]:
        for result in the_search[0]:
            users.append({
                    "userId": result.user_id,
                    "username": result.username,
                    "profilePic": result.profile_picture,
                    "name": result.name,
                })
    
    if the_search[1]:
        for result in the_search[1]:
            posts.append({
                "username": result[0].username,
                "name": result[0].name,
                "profilePic": result[0].profile_picture,
                "postId": result[1].post_id,
                "postTitle": result[1].post_title,
                "post": result[1].post,
                "postDate": result[1].post_date_made,
                })

    all_results = [users, posts]
    return jsonify({"searchResponse" : all_results})


@app.route('/user-details', methods=["POST"])
def get_profile(): 
    user_id = request.get_json("user")
    
    profileInformation = []
    all_posts = []
    userProfile = []

    if user_id:
    
        user = crud.get_user(user_id)
        posts = crud.list_posts(user_id)

        userProfile.append({
            "userId": user_id,
            "profilePic": user.profile_picture,
            "name": user.name,
            "username": user.username,
        })
        for post in posts:
            all_posts.append({
            "username": post[0].username,
            "name": post[0].name,
            "profilePic": post[0].profile_picture,
            "postId": post[1].post_id,
            "postTitle": post[1].post_title,
            "post": post[1].post,
            "postDate": post[1].post_date_made,
            })


        profileInformation = [userProfile, all_posts]

    return jsonify({"Profile" : profileInformation})


# @app.route('/post-details')
# def get_post(): 
#     post_id = request.get_json().get("clickedResult")


#     return jsonify({"postDetails" : postInformation})


@app.route('/follow-user', methods=["POST"])
def follow_user(): 
    follow_user_id = request.get_json("props.userId")
    user_id = crud.get_user_id(session['current_user'])
    following = crud.get_following(user_id)

    follow_id = []

    for person in following: 
        follow_id.append(person.user_id)

    following = []
    if follow_user_id != user_id and follow_user_id not in follow_id:
        followed = crud.follow_user(user_id, follow_user_id)

        following.append({
            "current_user_id": followed.user_id,
            "following": followed.follow_user_id,
            })
    
    return jsonify({"userFollowed" : following})


@app.route('/following', methods=["POST"])
def list_following(): 
    user_id = request.get_json("props.userId")
    
    print(user_id)
    following = crud.get_following(user_id)

    allFollowing = []

    for person in following:
        allFollowing.append({
            "userId": person.user_id,
            "profilePic": person.profile_picture,
            "usersName": person.name,
            "username": person.username, 
        })
    print(allFollowing)
    return jsonify({"everyoneFollowed" : allFollowing})


@app.route('/user-following', methods=["POST"])
def user_follows(): 
    user_id = crud.get_user_id(session['current_user'])
    other_user_id = request.get_json("props.userId")

    print(user_id)
    following = crud.get_following(user_id)

    allFollowing = []

    for person in following:
        if person.user_id == other_user_id:
            allFollowing.append({
                "userId": person.user_id,
                "profilePic": person.profile_picture,
                "usersName": person.name,
                "username": person.username, 
            })

    return jsonify({"everyoneFollowed" : allFollowing})


@app.route('/home-posts')
def get_post(): 
    user_id = crud.get_user_id(session['current_user'])

    posts = crud.all_home_posts(user_id)
    postInformation = []
    
    for i in range(len(posts)):
        postInformation.append({
            "username": posts[i][0].username,
            "name": posts[i][0].name,
            "profilePic": posts[i][0].profile_picture,
            "postId": posts[i][1].post_id,
            "postTitle": posts[i][1].post_title,
            "post": posts[i][1].post,
            "postDate": posts[i][1].post_date_made,
        })
    return jsonify({"allPosts" : postInformation})


if __name__ == "__main__":
    connect_to_db(app)
    app.secret_key = 'super secret key'
    app.run(host="0.0.0.0", debug=True)