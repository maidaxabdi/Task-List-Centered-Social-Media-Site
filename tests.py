from unittest import TestCase
from model import User, Follow, Post, Reward, Task, connect_to_db, db, example_data
from server import app
import server
import json 

class FlaskTestsBasic(TestCase):

    def setUp(self):

        self.client = app.test_client()
        app.config['TESTING'] = True
        app.config['SECRET_KEY'] = 'testing123'

        connect_to_db(app, "postgresql:///testdb")

    def tearDown(self):

        db.session.close()
        db.drop_all()

    def test_home(self):

        result = self.client.get("/")
        self.assertIn(b"Check", result.data)


class FlaskTestsLoggedIn(TestCase):
    def setUp(self):

        self.client = app.test_client()
        app.config['TESTING'] = True
        app.config['SECRET_KEY'] = 'testing123'
        
        connect_to_db(app, "postgresql:///testdb")

        db.create_all()
        example_data()

        with self.client as c:
            with c.session_transaction() as sess:
                sess['current_user'] = 'harry@test.com'

    def tearDown(self):

        db.session.close()
        db.drop_all()
    

    def test_login(self):

        result = self.client.post("/login",
                                  data={"email": "harry@test.com", "username": "harry", "password": "test0"},
                                  follow_redirects=True)
        self.assertIn(b"You have successfully logged in", result.data)


    def test_addTask(self):        
        response = self.client.post(
            '/add-task',
            json={"task": "Clean house"},
            )
        
        data = json.loads(response.get_data(as_text=True))
        self.assertEqual(data["addedTask"]['task'], "Clean house")
    

    def test_createReward(self):        
        response = self.client.post(
            '/create-reward',
            json={"reward": "Attend a BTS concert"},
            )
        
        data = json.loads(response.get_data(as_text=True))
        self.assertEqual(data["rewardCreated"]['reward'], "Attend a BTS concert")
    

    def test_createAmount(self):        
        response = self.client.post(
            '/create-amount',
            json={"amount": "20"},
            )
        
        data = json.loads(response.get_data(as_text=True))
        self.assertEqual(data["amountWantedDone"], "20")


    def test_newPost(self):        
        response = self.client.post(
            '/new-post',
            json={"post": "Fly me to the moon", "postTitle": "When should I?"},
            )
        
        data = json.loads(response.get_data(as_text=True))
        self.assertEqual(data["createdPost"]['post'], "Fly me to the moon")
        self.assertEqual(data["createdPost"]["postTitle"], "When should I?")


    def test_logout(self):
        result = self.client.get('/log-out', follow_redirects = True)
        self.assertIn(b"check", result.data)


if __name__ == "__main__":
    import unittest

    unittest.main()