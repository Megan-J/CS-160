#, jsonify, make_response
from datetime import datetime
from flask import Flask, request
from flask import request, jsonify, make_response
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
# from models import app, db, Addresses, CCInfo, CCTypes, Countries, Followers, OrderItems, Orders, Products, States, StoreFollowers, Storefronts, Tracks, Users
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
CORS(app) # enable cors for all routes
#url : mysql+mysqlconnector://username:password@localhost/db-name
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqlconnector://root:password@localhost/cloudsound'
#app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///cloud.db"
app.config['SQLALCHEMY_TRACK_NOTIFICATIONS'] = False
db = SQLAlchemy(app)

with app.app_context():
    db.reflect()

class Addresses(db.Model):
    __table__ = db.metadata.tables['Addresses']

class CCInfo(db.Model):
    __table__ = db.metadata.tables['CCInfo']

class CCTypes(db.Model):
    __table__ = db.metadata.tables['CCTypes']

class Countries(db.Model):
    __table__ = db.metadata.tables['Countries']

class Followers(db.Model):
    __table__ = db.metadata.tables['Followers']

class OrderItems(db.Model):
    __table__ = db.metadata.tables['OrderItems']

class Orders(db.Model):
    __table__ = db.metadata.tables['Orders']

class Products(db.Model):
    __table__ = db.metadata.tables['Products']

class States(db.Model):
    __table__ = db.metadata.tables['States']

class StoreFollowers(db.Model):
    __table__ = db.metadata.tables['StoreFollowers']

class Storefronts(db.Model):
    __table__ = db.metadata.tables['Storefronts']

class Tracks(db.Model):
    __table__ = db.metadata.tables['Tracks']

class Users(db.Model):
    __table__ = db.metadata.tables['Users']

#test route; must navigate to this url after activating 8080
@app.route('/home', methods=['GET'])
def get_contacts():
    data = {"message": "subscribe"}
    return jsonify(data)

#test get users
@app.route('/test1', methods=['GET'])
def get_user():
    try:
        id = 1
        users = Users()
        try:
            allusers = users.query.all()
        except Exception as e:
            return make_response(jsonify({'message': 'error getting users', 'error':str(e)}), 500)
        print("All users",allusers)
        if allusers:
            data = [{
                'aID': user.aID,
                'vchUsername': user.vchUsername,
                'vchEmail': user.vchEmail,
                'vchPassword': user.vchPassword,
                'vchFirstName': user.vchFirstName,
                'vchLastName': user.vchLastName,
                'bIsVerified': user.bIsVerified,
                'vchBio': user.vchBio,
                'vchProfilePicPath': user.vchProfilePicPath,
                'bIsBanned': user.bIsBanned
            } for user in allusers]
            return jsonify(data), 200
        return make_response(jsonify({'message': 'user not found'}), 404)
    except Exception as e:
        return make_response(jsonify({'message': 'error getting user', 'error':str(e)}), 500)

#test create new user
@app.route('/test2', methods=['GET'])
def make_user():
    try:
        new_user = Users(
            vchFirstName='Joe',
            vchLastName='Sixpack',
            vchUsername='j6',
            vchPassword='mypass',
            vchEmail='j6@j6.org'
        )
        db.session.add(new_user)
        db.session.commit()

        return jsonify({
            'vchFirstName': new_user.vchFirstName,
            'vchLastName': new_user.vchLastName,
            'vchPassword': new_user.vchPassword,
            'vchEmail': new_user.vchEmail
        }), 201
    
    except Exception as e:
        return make_response(jsonify({'message': 'Error creating user', 'error': str(e)}), 500)

#create store
@app.route('/store/create', methods=['POST'])
def create_stores():
    try:
        data = request.get_json()
        new_store = Storefronts(
            vchStoreName=data['vchStoreName'],
            nUserID=data['nUserID'],
            txtDescription=data['txtDescription']
        )
        db.session.add(new_store)
        db.session.commit()

        return jsonify({
            'id': new_store.aID,
            'name': new_store.vchStoreName,
            'user_id': new_store.nUserID,
            'description': new_store.txtDescription
        }), 201
    
    except Exception as e:
        return make_response(jsonify({'message': 'Error creating storefront', 'error': str(e)}), 500)

#get all stores
@app.route('/store/all', methods=['GET'])
def get_stores():
    try:
        stores = Storefronts.query.all()
        stores_data = [{'id': store.aID, 'name': store.vchStoreName, 'user': store.nUserID, 'txtDescription':store.txtDescription} for store in stores]
        return jsonify(stores_data), 200
    except Exception as e:
        return make_response(jsonify({'message': 'error getting users', 'error':str(e)}), 500)

#get all users
@app.route('/user/all', methods=['GET'])
def get_users():
    try:
        users = Users.query.all()
        users_data = [{'id': user.aID, 'username': user.vchUsername, 'email': user.vchEmail} for user in users]
        return jsonify(users_data), 200
    except Exception as e:
        return make_response(jsonify({'message': 'error getting users', 'error':str(e)}), 500)

#create user
@app.route('/user/create', methods=['POST'])
def create_user():
    try:
        data = request.get_json()
        new_user = Users(
            vchFirstName=data['vchFirstName'],
            vchLastName=data['vchLastName'],
            vchPassword=generate_password_hash(data['vchPassword']),
            vchEmail=data['vchEmail']
        )
        db.session.add(new_user)
        db.session.commit()

        return jsonify({
            'firstName': new_user.vchFirstName,
            'lastName': new_user.vchLastName,
            'password': new_user.vchPassword,
            'email': new_user.vchEmail
        }), 201
    
    except Exception as e:
        return make_response(jsonify({'message': 'Error creating user', 'error': str(e)}), 500)

#get user by id
app.route('/user/{id}', methods=['GET'])
def get_user(id):
    try:
        user = Users.query.filter_by(id=id).first() #get first user with id
        if user:
            return make_response(jsonify({'user': user.json()}), 200)
        return make_response(jsonify({'message': 'user not found'}), 404)
    except Exception as e:
        return make_response(jsonify({'message': 'error getting user', 'error':str(e)}), 500)


#port should be 8080
if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=False, port=8081)