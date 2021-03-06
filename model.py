from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


def connect_to_db(flask_app, db_uri="postgresql:///project", echo=True):
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
    username = db.Column(db.String(50), unique = True, nullable = False)
    name = db.Column(db.String(50))
    email = db.Column(db.String, nullable = False, unique = True)
    password = db.Column(db.String(50), nullable = False)
    bio = db.Column(db.String(110))
    is_private = db.Column(db.Boolean)
    header = db.Column(db.String)
    profile_picture = db.Column(db.String)
    tasks_completed = db.Column(db.Integer)
    date_account_created = db.Column(db.DateTime)

    follows = db.relationship("User", secondary="following", primaryjoin=("User.user_id == Follow.user_id"), secondaryjoin=("User.user_id == Follow.follow_user_id"))
    groups = db.relationship("Group", secondary="user_group", backref="users")


    def __repr__(self):
        return f'<User user_id={self.user_id} username={self.username}>'


class Task(db.Model):
    """A task"""

    __tablename__ = "tasks"

    task_id = db.Column(db.Integer,
                        autoincrement= True,
                        primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.user_id"))
    task = db.Column(db.Text, nullable = False)
    urgency = db.Column(db.String)
    recurring = db.Column(db.Boolean)
    active = db.Column(db.Boolean)

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
    reminder = db.Column(db.String(140), nullable = False)

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
    reward = db.Column(db.String(140), nullable = False)
    
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
    post = db.Column(db.Text, nullable = False)
    post_date_made = db.Column(db.DateTime)
    is_private = db.Column(db.Boolean)
    post_title = db.Column(db.String(140), nullable = False)
    picture = db.Column(db.String)

    user_posts = db.relationship("User", backref="posts")

    def __repr__(self):
        return f'<Post post_id={self.post_id} post_title={self.post_title}>'


class Post_Interactions(db.Model):
    """A user's post interactions."""

    __tablename__ = "post_interactions"

    post_interaction_id = db.Column(db.Integer,
                        autoincrement= True,
                        primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.user_id"))
    post_id = db.Column(db.Integer, db.ForeignKey("posts.post_id"))
    comment = db.Column(db.Text)
    comment_date_made = db.Column(db.DateTime)
    post_liked = db.Column(db.Boolean)


    user_interactions = db.relationship("User", backref="post_interactions")
    interactions = db.relationship("Post", backref="post_interactions")

    def __repr__(self):
        return f'<Post Interactions post_interaction_id={self.post_interaction_id}>'


class Comment_Interactions(db.Model):
    """A user's comment interactions."""

    __tablename__ = "comment_interactions"

    comment_interaction_id = db.Column(db.Integer,
                        autoincrement= True,
                        primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.user_id"))
    post_interaction_id = db.Column(db.Integer, db.ForeignKey("post_interactions.post_interaction_id"))
    comments_comment = db.Column(db.Text)
    comments_date_made = db.Column(db.DateTime)
    comment_liked = db.Column(db.Boolean)


    user_comment_interactions = db.relationship("User", backref="comment_interactions")
    interactions = db.relationship("Post_Interactions", backref="comment_interactions")

    def __repr__(self):
        return f'<Comment Interactions comment_interaction_id={self.comment_interaction_id}>'


class Follow(db.Model):
    """A Follow - association table to connect two users together"""

    __tablename__ = "following"

    following_id = db.Column(db.Integer,
                        autoincrement= True,
                        primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.user_id"))
    follow_user_id = db.Column(db.Integer, db.ForeignKey("users.user_id"))

    def __repr__(self):
        return f'<Following following_id={self.following_id}>'


class Group(db.Model):
    """A group"""

    __tablename__ = "groups"

    group_id = db.Column(db.Integer,
                        autoincrement= True,
                        primary_key=True)
    group_name = db.Column(db.String(70), nullable = False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.user_id"))


    group_creater = db.relationship("User", backref="created_group")

    def __repr__(self):
        return f'<Group group_id={self.following_id} group_name={self.group_name}>'


class User_Group(db.Model):
    """Association table for Group and Users"""

    __tablename__ = "user_group"

    user_group_id = db.Column(db.Integer,
                        autoincrement= True,
                        primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.user_id"))
    group_id = db.Column(db.Integer, db.ForeignKey("groups.group_id"))

    def __repr__(self):
        return f'<User_Group user_group_id={self.user_group_id}>'


def example_data():
    """Create some sample data."""

    User.query.delete()

    Harry = User(email='harry@test.com', username='harry', password="test0")
    Ron = User(email='ron@test.com', username='ron', password="test1")
    Hermione = User(email='hermione@test.com', username='hermione', password="test2")
    Draco = User(email='draco@test.com', username='draco', password="test3")
    
    db.session.add_all([Harry, Ron, Hermione, Draco])
    db.session.commit()


if __name__ == "__main__":
    from server import app

    connect_to_db(app)
