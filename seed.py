import os 
from random import choice, randint
import model, server, crud 
from datetime import datetime

os.system('dropdb project')
os.system('createdb project')

model.connect_to_db(server.app)
model.db.create_all()


## FAKE DATA

random_task = ['clean house', 'take trash outside', 'doing homework']
choose_reward = ['book a plane ticket', 'go to a fancy resturant', 'buy a new dress']
reminder_choose = ['remember to go to the gym', 'remember to start journaling', 'remember to start wearing makeup again']
post_choose = ['I overslept today', 'I want to go to Korea one day', "I've always wanted to create a movie"]
choose_post_title = ["Things I've wanted to do", "My greatest wish", 'I am not having a good day today']
write_comment = ['Interesting take!', 'I love this!', 'Me too']
choose_group_name = ["Writer's group", "Ochem 2", "Coding Bootcammp"]


for n in range(10):
    email = f'user{n}@test.com' 
    password = 'test'
    username = f'person{n}'
    date_account_created = datetime.now().replace(second=0, microsecond=0)
    user = crud.create_user(email, password, username, date_account_created)
    
    task = choice(random_task)
    user_id = user.user_id
    crud.create_task(user_id, task)

    reward = choice(choose_reward)
    crud.create_reward(user_id, reward)

    reminder = choice(reminder_choose)
    crud.create_reminder(user_id, reminder)

    post = choice(post_choose)
    post_title = choice(choose_post_title)
    post_date_made = datetime.now().replace(second=0, microsecond=0)
    the_post = crud.create_post(user_id, post, post_date_made, post_title)

    comment = choice(write_comment)
    comment_date_made = datetime.now().replace(second=0, microsecond=0)
    post_id = the_post.post_id
    crud.create_comment(user_id, post_id, comment, comment_date_made)

    group_name = choice(choose_group_name)
    group = crud.create_group(user_id, group_name)
    # group_id = group
    # crud.join_group(user_id, group_id)



