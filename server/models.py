from flask import Flask, request, jsonify, make_response
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import datetime
import mysql.connector
#from os import environ

app = Flask(__name__)
CORS(app) # enable cors for all routes
#url : mysql+mysqlconnector://username:password@localhost/db-name
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqlconnector://root:mysql@localhost/cloud'
#app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///cloud.db"
app.config['SQLALCHEMY_TRACK_NOTIFICATIONS'] = False

#db = SQLAlchemy(app)

connection = mysql.connector.connect(
    host="localhost",
    user="root",
    password="mysql",
    database="cloud"
)

cursor = connection.cursor()

#cursor.execute("CREATE DATABASE IF NOT EXISTS cloud")
#cursor.execute("USE cloud")

sql_query = """
CREATE TABLE IF NOT EXISTS users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(80) NOT NULL,
    last_name VARCHAR(80) NOT NULL,
    username VARCHAR(80) NOT NULL,
    email VARCHAR(120) NOT NULL,
    password VARCHAR(120) NOT NULL,
    bio VARCHAR(5000),
    pfp VARCHAR(2000)
);

CREATE TABLE IF NOT EXISTS tracks (
    id INT PRIMARY KEY AUTO_INCREMENT,
    author_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    audio_url VARCHAR(255) NOT NULL,
    image VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users(user_id)
);

CREATE TABLE IF NOT EXISTS followers (
    follower_id INT NOT NULL,
    following_id INT NOT NULL,
    PRIMARY KEY (follower_id, following_id),
	FOREIGN KEY (follower_id) REFERENCES users(user_id),
    FOREIGN KEY (following_id) REFERENCES users(user_id)
);
CREATE TABLE IF NOT EXISTS storefronts (
    store_id INT PRIMARY KEY,
    store_name VARCHAR(255) NOT NULL,
    description TEXT,
    follower_count INT DEFAULT 0,
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE IF NOT EXISTS product (
    ProductID INT PRIMARY KEY AUTO_INCREMENT,
    store_id INT,
    Name VARCHAR(255) NOT NULL,
    Description TEXT,
    Price DECIMAL(10, 2) NOT NULL,
    StockQuantity INT NOT NULL,
    ImageURL VARCHAR(255),
    FOREIGN KEY (store_id) REFERENCES storefronts(store_id)
);

CREATE TABLE IF NOT EXISTS order_table (
    OrderID INT PRIMARY KEY AUTO_INCREMENT,
    UserID INT,
    store_id INT,
    OrderDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    TotalAmount DECIMAL(10, 2) NOT NULL,
    Status VARCHAR(20) DEFAULT 'Pending',
    Address VARCHAR(500) NOT NULL,
    FOREIGN KEY (UserID) REFERENCES users(user_id),
    FOREIGN KEY (store_id) REFERENCES storefronts(store_id)
);

CREATE TABLE IF NOT EXISTS order_item (
    OrderItemID INT PRIMARY KEY AUTO_INCREMENT,
    OrderID INT,
    ProductID INT,
    Quantity INT,
    Price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (OrderID) REFERENCES order_table(OrderID),
    FOREIGN KEY (ProductID) REFERENCES product(ProductID)
);

CREATE TABLE IF NOT EXISTS payment (
    PaymentID INT PRIMARY KEY AUTO_INCREMENT,
    OrderID INT,
    PaymentDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Amount DECIMAL(10, 2) NOT NULL,
    PaymentMethod VARCHAR(50),
    TransactionID VARCHAR(100),
    FOREIGN KEY (OrderID) REFERENCES order_table(OrderID)
);          
"""
cursor.execute(sql_query, multi=True)

connection.commit()

cursor.close()
connection.close()

'''
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