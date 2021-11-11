from model import Comment_Interactions, db, User, Task, Reminder, Reward, Follow, Post, Post_Interactions, Group, User_Group, connect_to_db
from random import choice 


## CREATE USER 

def create_user(email, password, username, date_account_created, tasks_completed = 30, name = None, profile_picture = None, is_private = False):
    user = User(email=email, password=password, username = username, 
                tasks_completed = tasks_completed, name = name, profile_picture = profile_picture, 
                is_private = is_private, date_account_created = date_account_created)

    db.session.add(user)
    db.session.commit()

    return user


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


## CREATE TASK 

def create_task(user_id, task, urgency, recurring = False, active = True):
    task = Task(user_id = user_id, task = task, urgency = urgency, 
                recurring = recurring, active = active)


    db.session.add(task)
    db.session.commit()

    return task


## RETURN LIST OF USERS TASKS

def list_tasks(user_id):
    tasks = Task.query.filter_by(user_id = user_id).all()
    
   
    return tasks


## RETURN LENGTH OF LIST BY USER

def number_tasks(user_id):
    tasks_count = Task.query.filter_by(user_id = user_id).count()

    return tasks_count


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
    follow_user = User(user_id = user_id, follow_user_id = follow_user_id)

    db.session.add(follow_user)
    db.session.commit()

    return follow_user


## FOLLOW ANOTHER USER

def follow_user(user_id, follow_user_id):
    follow_user = Follow(user_id = user_id, follow_user_id = follow_user_id)

    return follow_user


## RETURN LIST OF FOLLOWING

def get_following(user_id):
    users_following = Follow.query.filter(Follow.user_id == user_id).group_by(Follow.follow_user_id).all()
   
    return users_following


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
    result += User.query.filter(User.name.like(f'%{search}%')).all()
    result += User.query.filter(User.username.like(f'%{search}%')).all()
    result += Post.query.filter(Post.post.like(f'%{search}%')).all()
    result += Post_Interactions.query.filter(Post_Interactions.comment.like(f'%{search}%')).all()
    result += Comment_Interactions.query.filter(Comment_Interactions.comments_comment.like(f'%{search}%')).all()

    return result 




if __name__ == '__main__':
    from server import app
    connect_to_db(app)