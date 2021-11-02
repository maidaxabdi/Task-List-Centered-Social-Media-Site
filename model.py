from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


def connect_to_db(flask_app, db_uri="postgresql:///ratings", echo=True):
    flask_app.config["SQLALCHEMY_DATABASE_URI"] = db_uri
    flask_app.config["SQLALCHEMY_ECHO"] = echo
    flask_app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    db.app = flask_app
    db.init_app(flask_app)

    print("Connected to the db!")


class User(db.Model):
    """A user."""

    __tablename__ = "users"

    user_id = db.Column(db.Integer,
                        autoincrement= True,
                        primary_key=True)
    username = db.Column(db.String(20), unique = True)
    name = db.Column(db.String(20))
    password = db.Column(db.String(25))
    is_private = db.Column(db.Boolean)
    profile_picture = db.Column(db.String)
    date_account_created = db.Column(db.DateTime)

    def __repr__(self):
        return f'<User user_id={self.user_id} username={self.username}>'


class Task(db.Model):
    """A task"""

    __tablename__ = "tasks"

    task_id = db.Column(db.Integer,
                        autoincrement= True,
                        primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.user_id"))
    task = db.Column(db.Text)
    urgency = db.Column(db.String)
    reoccurring = db.Column(db.Boolean)
    Active = db.Column(db.Boolean)

    user = db.relationship("User", backref="tasks")

    def __repr__(self):
        return f'<Task task_id={self.task_id} active={self.active}>'


class Reminder(db.Model):
    """A reminder"""

    __tablename__ = "reminders"

    reminder_id = db.Column(db.Integer,
                        autoincrement= True,
                        primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.user_id"))
    text = db.Column(db.String(140))

    user_remember = db.relationship("User", backref="reminders")

    def __repr__(self):
        return f'<Reminder reminder_id={self.reminder_id}>'


class Reward(db.Model):
    """A reward"""

    __tablename__ = "rewards"

    reward_id = db.Column(db.Integer,
                        autoincrement= True,
                        primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.user_id"))
    reward = db.Column(db.String(140))
    tasks_completed = db.Column(db.Integer)

    user_rewards = db.relationship("User", backref="rewards")

    def __repr__(self):
        return f'<Reward reward_id={self.reward_id}>'


class Post(db.Model):
    """A post."""

    __tablename__ = "posts"

    post_id = db.Column(db.Integer,
                        autoincrement= True,
                        primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.user_id"))
    post = db.Column(db.Text)
    post_date_made = db.Column(db.DateTime)
    is_private = db.Column(db.Boolean)
    post_title = db.Column(db.String(140))

    user_posts = db.relationship("User", backref="posts")

    def __repr__(self):
        return f'<Post post_id={self.post_id} post_title={self.post_title}>'


class Interactions(db.Model):
    """A user's post interactions."""

    __tablename__ = "post_interactions"

    interaction_id = db.Column(db.Integer,
                        autoincrement= True,
                        primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.user_id"))
    post_id = db.Column(db.Integer, db.ForeignKey("posts.post_id"))
    comment = db.Column(db.Text)
    liked = db.Column(db.Boolean)


    user_interactions = db.relationship("User", backref="interactions")
    post_interactions = db.relationship("User", backref="interactions")

    def __repr__(self):
        return f'<Interactions interaction_id={self.interaction_id}>'


class Following(db.Model):
    """A Follow"""

    __tablename__ = "following"

    following_id = db.Column(db.Integer,
                        autoincrement= True,
                        primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.user_id"))
    following_user_id = db.Column(db.Integer, db.ForeignKey("users.user_id"))

    user_follows = db.relationship("User", backref="follows")

    def __repr__(self):
        return f'<Following following_id={self.following_id}>'


class Group(db.Model):
    """A group"""

    __tablename__ = "groups"

    group_id = db.Column(db.Integer,
                        autoincrement= True,
                        primary_key=True)
    group_name = db.Column(db.String(70))
    user_id = db.Column(db.Integer, db.ForeignKey("users.user_id"))
    task_id = db.Column(db.Integer, db.ForeignKey("users.user_id"))

    user_groups = db.relationship("User", backref="groups")

    def __repr__(self):
        return f'<Group group_id={self.following_id} group_name={self.group_name}>'



if __name__ == "__main__":
    from server import app

    connect_to_db(app)