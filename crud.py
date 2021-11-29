from model import Comment_Interactions, db, User, Task, Reminder, Reward, Follow, Post, Post_Interactions, Group, User_Group, connect_to_db
from random import choice 
from datetime import datetime

## CREATE USER 

def create_user(email, password, username, date_account_created, tasks_completed = 30, name = None, profile_picture = None, is_private = False):
    user = User(email=email, password=password, username = username, 
                tasks_completed = tasks_completed, name = name, profile_picture = profile_picture, 
                is_private = is_private, date_account_created = date_account_created)

    db.session.add(user)
    db.session.commit()

    return user


## EDIT USERS PROFILE PAGE
def edit_profile(user_id, name= None, profile_picture= None):
    get_user = User.query.filter_by(user_id = user_id).first()

    if name is not None:
        get_user.name = name
    if profile_picture is not None:
        get_user.profile_picture = profile_picture

    db.session.add(get_user)
    db.session.commit()

    return get_user


## CHECK IF USER WITH THAT EMAIL ALREADY EXISTS

def get_user_by_email(email):

    return User.query.filter_by(email = email).first()


## GET USER ID BY EMAIL

def get_user_id(email):
    user = User.query.filter_by(email = email).first()
    user_id = user.user_id
    return user_id

## CHECK IF USER WITH THAT USERNAME ALREADY EXISTS

def get_user_by_username(username):

    return User.query.filter_by(username = username).first()


## CHECK IF USER BY USER ID

def get_user(user_id):

    return User.query.filter_by(user_id = user_id).first()


## CREATE TASK 

def create_task(user_id, task, recurring = False, active = True):
    task = Task(user_id = user_id, task = task, 
                recurring = recurring, active = active)


    db.session.add(task)
    db.session.commit()

    return task


## RETURN LIST OF USERS TASKS

def list_tasks(user_id):
    tasks = Task.query.filter_by(user_id = user_id).all()
    
   
    return tasks


## RETURN COUNT OF COMPLETED TASKS

def completed_count(user_id):
    completed_count = Task.query.filter(Task.user_id == user_id, Task.active == False).count()

    return completed_count


## DEACTIVATE TASK BY TASK ID

def completed_task(taskId, user_id):
    get_task = Task.query.filter(Task.task_id == taskId and Task.user_id == user_id).first()
    get_task.active = False

    db.session.add(get_task)
    db.session.commit()

    return get_task


## DELETE TASK BY TASK ID

def delete_task(taskId, user_id):
    get_task = Task.query.filter(Task.task_id == taskId and Task.user_id == user_id).delete()

    db.session.commit()

    return get_task


## GET TASK BY TASK ID

def get_task(taskId, user_id):
    get_task = Task.query.filter(Task.task_id == taskId and Task.user_id == user_id).first()

    return get_task


## GET REWARD BY REWARD ID

def get_reward(rewardId, user_id):
    get_reward = Reward.query.filter(Reward.reward_id == rewardId and Reward.user_id == user_id).first()

    return get_reward


## DELETE REWARD BY REWARD ID

def delete_reward(rewardId, user_id):
    get_reward = Reward.query.filter(Reward.reward_id == rewardId and Reward.reward_id == user_id).delete()

    db.session.commit()

    return get_reward


# CREATE REWARD SYSTEM FOR TASKS

def create_reward(user_id, reward):
    reward = Reward(user_id = user_id, reward = reward)


    db.session.add(reward)
    db.session.commit()

    return reward


## SET AMOUNT TASKS COMPLETED UNTILL REWARD TO USER
def set_amount(user_id, amount):
    user = User.query.filter(User.user_id == user_id).first()
    user.tasks_completed = amount

    db.session.add(user)
    db.session.commit()

    return user


## FIND OUT AMOUNT USER NEEDS TO COMPLETE FOR REWARD
def amount_reward(user_id):
    get_amount = User.query.filter(User.user_id == user_id).first()

    return get_amount.tasks_completed


## Return Random Reward From List of Rewards

def random_reward(user_id):
    get_rewards = Reward.query.filter(Reward.user_id == user_id).all()
    random_reward = choice(get_rewards)
    
    reward = random_reward.reward
    return reward
    

## Return List of Rewards

def list_rewards(user_id):
    get_rewards = Reward.query.filter(Reward.user_id == user_id).all()
    
    return get_rewards
    
    
## CREATE REMINDERS

def create_reminder(user_id, reminder):
    reminder = Reminder(user_id = user_id, reminder = reminder)


    db.session.add(reminder)
    db.session.commit()

    return reminder


## CREATE POST

def create_post(user_id, post, post_date_made, post_title, is_private = False):
    post = Post(user_id = user_id, post = post, post_date_made = post_date_made, is_private = is_private, post_title = post_title)
    
    db.session.add(post)
    db.session.commit()

    return post


## GET POST BY POST ID

def get_post(postId, user_id):
    get_post = Post.query.filter(Post.post_id == postId and Reward.user_id == user_id).first()

    return get_post


## RETURN LIST OF POSTS

def list_posts(user_id):
    get_posts = Post.query.filter(Post.user_id == user_id).all()
    all_posts = Post.query.options(db.joinedload('user_posts')).all()
    posts = []
    
    for post in all_posts:
        if post in get_posts:
            posts.append([post.user_posts, post])

    sorted_list = sorted(posts, key=lambda t: t[1].post_date_made)
    sorted_list.reverse()
    return sorted_list


def all_home_posts(user_id):
    get_posts = Post.query.filter(Post.user_id == user_id).all()
    all_posts = Post.query.options(db.joinedload('user_posts')).all()
    posts = []

    user = User.query.filter_by(user_id = user_id).first()
    following_posts = []

    for i in range(len(user.follows)):
        following_posts.append(user.follows[i].posts)


    for post in all_posts:
        if post in get_posts:
            posts.append([post.user_posts, post])
    
    for user in following_posts:
        for post in user:
            if post in all_posts:
                posts.append([post.user_posts, post])

    sorted_list = sorted(posts, key=lambda t: t[1].post_date_made)
    sorted_list.reverse()
    return sorted_list


## DELETE POST BY POST ID

def delete_post(postId, user_id):
    get_post = Post.query.filter(Post.user_id == user_id, Post.post_id == postId).delete()

    db.session.commit()

    return get_post


## CREATE COMMENT 

def create_comment(user_id, post_id, comment, comment_date_made):
    comment = Post_Interactions(user_id = user_id, post_id = post_id, comment = comment, 
                            comment_date_made = comment_date_made)

    db.session.add(comment)
    db.session.commit()

    return comment


## RETURN LIST OF USERS LIKED POSTS

def users_likes(user_id):
    likes = []
    likes.extend(Post_Interactions.query.filter(Post_Interactions.user_id == user_id & Post_Interactions.liked == True).all())
    likes.extend(Comment_Interactions.query.filter(Comment_Interactions.user_id == user_id & Comment_Interactions.liked == True).all())
    
    #likes[0].user_interactions
    #likes[0].post_interactions

    return likes


## CREATE GROUP

def create_group(user_id, group_name):
    group = Group(user_id = user_id, group_name = group_name)

    db.session.add(group)
    db.session.commit()

    return group


## USER JOIN GROUP

def join_group(user_id, group_id):
    join_group = User_Group(user_id = user_id, group_id = group_id)

    db.session.add(join_group)
    db.session.commit()

    return join_group


## RETURN USERS IN GROUP

def users_in_group(group_id):

    users_in_group = User_Group.query.filter(User_Group.group_id == group_id).group_by(User_Group.user_id).all()


    return users_in_group


## FOLLOW USER

def follow_user(user_id, follow_user_id):
    follow_user = Follow(user_id = user_id, follow_user_id = follow_user_id)

    db.session.add(follow_user)
    db.session.commit()

    return follow_user


## RETURN LIST OF FOLLOWING

def get_following(user_id):
    user = User.query.filter_by(user_id = user_id).first()

    return user.follows


## RETURN LIST OF FOLLOWERS

def get_followers(user_id):
    followers = Follow.query.filter(Follow.follow_user_id == user_id).group_by(Follow.user_id).all()
    
    return followers


## RETURN COUNT OF FOLLOWING

def count_following(user_id):
    count_following = Follow.query.filter(Follow.user_id == user_id).count(Follow.follow_user_id).all()

    return count_following


## RETURN COUNT OF FOLLOWERS

def count_followers(user_id):
    count_followers = Follow.query.filter(Follow.follow_user_id == user_id).count(Follow.user_id).all()

    return count_followers


## UNFOLLOW USER




## SEARCH FOR USERS / POSTS / GROUPS

def search_site(search):
    result = []

    user = User.query.filter(User.username.like(f'%{search}%') | User.name.like(f'%{search}%')).all()
    result_posts = Post.query.filter(Post.post.like(f'%{search}%')).all()
    all_posts = Post.query.options(db.joinedload('user_posts')).all()
    posts = []
    
    for post in all_posts:
        if post in result_posts:
            posts.append([post.user_posts, post])
            

    sorted_list = sorted(posts, key=lambda t: t[1].post_date_made)
    sorted_list.reverse()
    result = [user, sorted_list]
    print(result)
    return result
    

if __name__ == '__main__':
    from server import app
    connect_to_db(app)