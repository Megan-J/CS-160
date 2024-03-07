from flask import Flask, request, jsonify, make_response
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import datetime
#from os import environ

app = Flask(__name__)
CORS(app) # enable cors for all routes
#url : mysql+mysqlconnector://username:password@localhost/db-name
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqlconnector://root:mysql@localhost/cloud'
#app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///cloud.db"
app.config['SQLALCHEMY_TRACK_NOTIFICATIONS'] = False

db = SQLAlchemy(app)

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    first_name = db.Column(db.String(80), nullable=False)
    last_name = db.Column(db.String(80), nullable=False)
    username = db.Column(db.String(80), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    password = db.Column(db.String(120), nullable=False)
    bio = db.Column(db.String(5000))
    pfp = db.Column(db.String(2000))

    def to_json(self):
        return {'id': self.id, 'first_name': self.first_name, 'last_name': self.last_name, 'username': self.username, 'email': self.email, 'password': self.password, 'bio': self.bio, 'pfp': self.pfp}
    

class Track(db.Model):
    __tablename__ = 'tracks'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    author_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False) # for now only tracks with one author
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    audio_url = db.Column(db.String(255), nullable=False)
    image = db.Column(db.String(255))
    created_at = db.Column(db.TIMESTAMP, default=datetime.utcnow)

    # Define relationship to the User model
    #user = dbc.relationship('User', backref=db.backref('tracks', lazy=True))

    def to_json(self):
        return {'id': self.id, 'user_id': self.user_id ,'title': self.title, 'description': self.description, 'audio_url': self.audio_url, 'image': self.image, 'created_at': self.created_at}



#create new user
@app.route('/create_contact', methods=['POST'])
def create_user():
    try:
        data = request.get_json()
        new_user = User(name=data['name'], email=data['email'])
        db.session.add(new_user)
        db.session.commit()
    
        return jsonify({
            'id': new_user.id,
            'name': new_user.name,
            'email': new_user.email
        }), 201
    
    except Exception as e:
        return make_response(jsonify({'message': 'error creating user', 'error':str(e)}), 500)

'''   
#get all users
app.route('/api/flask/users', methods=['GET'])
def get_users():
    try:
        users = User.query.all()
        users_data = [{'id': user.id,'name': user.name, 'email': user.email} for user in users]
        return jsonify(users_data), 200
    except Exception as e:
        return make_response(jsonify({'message': 'error getting users', 'error':str(e)}), 500)
    
#get user by id
app.route('/api/flask/users/<id>', methods=['GET'])
def get_user(id):
    try:
        user = User.query.filter_by(id=id).first() #get first user with id
        if user:
            return make_response(jsonify({'user': user.json()}), 200)
        return make_response(jsonify({'message': 'user not found'}), 404)
    except Exception as e:
        return make_response(jsonify({'message': 'error getting user', 'error':str(e)}), 500)
    
#update user by id
@app.route('/api/flask/users/<id>', methods=['PUT'])
def update_user(id):
    try:
        user = User.query.filter_by(id=id).first()
        if user:
            data = request.get_json()
            user.name = data['name']
            user.email = data['email']
            db.session.commit()
            return make_response(jsonify({'message': 'user updated'}), 200)
        return make_response(jsonify({'message': 'user not found'}), 404)
    except Exception as e:
        return make_response(jsonify({'message': 'error updating user', 'error':str(e)}), 500)
    
    
#delete a user by id
@app.route('/api/flask/users/<id>', methods=['DELETE'])
def delete_user(id):
    try:
        user = User.query.filter_by(id=id).first()
        if user:
            db.session.delete(user)
            db.session.commit()
            return make_response(jsonify({'message': 'user updated'}), 200)
        return make_response(jsonify({'message': 'user not found'}), 404)
    except Exception as e:
        return make_response(jsonify({'message': 'error updating user', 'error':str(e)}), 500)
 

'''