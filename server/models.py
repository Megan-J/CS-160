from flask import Flask, request
#, jsonify, make_response
from flask import Flask, request
#, jsonify, make_response
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import datetime
#from os import environ

app = Flask(__name__)
CORS(app) # enable cors for all routes
#url : mysql+mysqlconnector://username:password@localhost/db-name
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqlconnector://root:password123@localhost/cloud'
#app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///cloud.db"
app.config['SQLALCHEMY_TRACK_NOTIFICATIONS'] = False

db = SQLAlchemy(app)

class Users(db.Model):
    __tablename__ = 'users'
    aID = db.Column(db.Integer, primary_key=True, autoincrement=True)
    vchUsername = db.Column(db.String(45), nullable=False)
    vchPassword = db.Column(db.String(45), nullable=False)
    dtLastLogin = db.Column(db.TIMESTAMP, default=datetime.utcnow)
    vchFirstName = db.Column(db.String(45), nullable=True)
    vchLastName = db.Column(db.String(45), nullable=True)
    vchNickname = db.Column(db.String(45), nullable=True)
    vchEmail = db.Column(db.String(45), nullable=False)
    bIsVerified = db.Column(db.Integer, nullable=False)
    txtBio = db.Column(db.Text, nullable=True)
    vchProfilePicPath = db.Column(db.String(255), nullable=True)
    bIsBanned = db.Column(db.Integer, nullable=False)
    dtUpdateDate = db.Column(db.TIMESTAMP, default=datetime.utcnow)
    dtInsertDate = db.Column(db.TIMESTAMP, default=datetime.utcnow)

    def to_json(self):
        return {'aID': self.aID, 'vchUsername': self.vchUsername, 'vchPassword': self.vchPassword, 'dtLastLogin': self.dtLastLogin, 'vchFirstName': self.vchFirstName, 'vchLastName': self.vchLastName, 'vchNickname': self.vchNickname, 'vchEmail': self.vchEmail, 'txtBio': self.txtBio, 'vchProfilePicPath': self.vchProfilePicPath, 'nShippingAddressID': self.nShippingAddressID, 'nBillingAddressID': self.nBillingAddressID, 'bIsBanned': self.bIsBanned, 'dtUpdateDate': self.dtUpdateDate, 'dtInsertDate': self.dtInsertDate}

#db.ForeignKey('users.aID'),
class Storefronts(db.Model):
    __tablename__ = 'storefronts'
    aID = db.Column(db.Integer, primary_key=True, autoincrement=True)
    vchStoreName = db.Column(db.String(45), nullable=False)
    nUserID = db.Column(db.Integer, nullable=False)
    txtDescription = db.Column(db.Text, nullable=False)
    dtUpdateDate = db.Column(db.TIMESTAMP, default=datetime.utcnow)
    dtInsertDate = db.Column(db.TIMESTAMP, default=datetime.utcnow)

    def to_json(self):
        return {'aID': self.aID, 'vchStoreName': self.vchStoreName, 'nUserID': self.nUserID, 'txtDescription': self.txtDescription, 'dtUpdateDate': self.dtUpdateDate, 'dtInsertDate': self.dtInsertDate}

class Products(db.Model):
    __tablename__ = 'products'
    aID = db.Column(db.Integer, primary_key=True, autoincrement=True)
    nStoreID = db.Column(db.Integer, db.ForeignKey('storefronts.aID'), nullable=False)
    vchProductName = db.Column(db.String(45), nullable=False)
    vchProductDesc = db.Column(db.String(45), nullable=True)
    fPrice = db.Column(db.Float, nullable=False)
    bIsDeleted = db.Column(db.Integer, nullable=False)
    dtUpdateDate = db.Column(db.TIMESTAMP, default=datetime.utcnow)
    dtInsertDate = db.Column(db.TIMESTAMP, default=datetime.utcnow)

    def to_json(self):
        return {'aID': self.aID, 'vchProductName': self.vchProductName, 'vchProductDesc': self.vchProductDesc, 'fPrice': self.fPrice, 'bIsDeleted': self.bIsDeleted, 'dtUpdateDate': self.dtUpdateDate, 'dtInsertDate': self.dtInsertDate}
  
        return {'aID': self.aID, 'vchProductName': self.vchProductName, 'vchProductDesc': self.vchProductDesc, 'fPrice': self.fPrice, 'bIsDeleted': self.bIsDeleted, 'dtUpdateDate': self.dtUpdateDate, 'dtInsertDate': self.dtInsertDate}
  
class CCInfo(db.Model):
    __tablename__ = 'ccinfo'
    aID = db.Column(db.Integer, primary_key=True, autoincrement=True)
    nUserID = db.Column(db.Integer, db.ForeignKey('users.aID'), nullable=False)
    vchCCNumber = db.Column(db.String(45), nullable=False)
    vchCCType = db.Column(db.String(45), nullable=False)
    vchCCExp = db.Column(db.String(45), nullable=False)
    vchCCV = db.Column(db.String(45), nullable=False)
    bIsPreferred = db.Column(db.Integer, nullable=False)
    bIsDeleted = db.Column(db.Integer, nullable=False)
    dtUpdateDate = db.Column(db.TIMESTAMP, default=datetime.utcnow)
    dtInsertDate = db.Column(db.TIMESTAMP, default=datetime.utcnow)

    def to_json(self):
        return {'aID': self.aID, 'nUserID': self.nUserID, 'vchCCNumber': self.vchCCNumber, 'vchCCType': self.vchCCType, 'vchCCExp': self.vchCCExp, 'vchCCV': self.vchCCV, 'bIsPreferred': self.bIsPreferred, 'bIsDeleted': self.bIsDeleted, 'dtUpdateDate': self.dtUpdateDate, 'dtInsertDate': self.dtInsertDate}

class Countries(db.Model):
    __tablename__ = 'countries'
    aID = db.Column(db.Integer, primary_key=True, autoincrement=True)
    vchCountryName = db.Column(db.String(45), nullable=False)
    vchCountryAbbr = db.Column(db.String(45), nullable=False)
    bPriority = db.Column(db.Integer, nullable=False)
    bIsDeleted = db.Column(db.Integer, nullable=False)
    dtUpdateDate = db.Column(db.TIMESTAMP, default=datetime.utcnow)
    dtInsertDate = db.Column(db.TIMESTAMP, default=datetime.utcnow)

    def to_json(self):
        return {'aID': self.aID, 'vchCountryName': self.vchCountryName, 'vchCountryAbbr': self.vchCountryAbbr, 'bPriority': self.bPriority, 'bIsDeleted': self.bIsDeleted, 'dtUpdateDate': self.dtUpdateDate, 'dtInsertDate': self.dtInsertDate}

class States(db.Model):
    __tablename__ = 'states'
    aID = db.Column(db.Integer, primary_key=True, autoincrement=True)
    vchStateName = db.Column(db.String(45), nullable=False)
    vchStateAbbr = db.Column(db.String(45), nullable=False)
    fTaxRate = db.Column(db.Float, nullable=False)
    bIsDeleted = db.Column(db.Integer, nullable=False)
    dtUpdateDate = db.Column(db.TIMESTAMP, default=datetime.utcnow)
    dtInsertDate = db.Column(db.TIMESTAMP, default=datetime.utcnow)

    def to_json(self):
        return {'aID': self.aID, 'vchStateName': self.vchStateName, 'vchStateAbbr': self.vchStateAbbr, 'fTaxRate': self.fTaxRate, 'bIsDeleted': self.bIsDeleted, 'dtUpdateDate': self.dtUpdateDate, 'dtInsertDate': self.dtInsertDate}

class States(db.Model):
    __tablename__ = 'states'
    aID = db.Column(db.Integer, primary_key=True, autoincrement=True)
    vchStateName = db.Column(db.String(45), nullable=False)
    vchStateAbbr = db.Column(db.String(45), nullable=False)
    fTaxRate = db.Column(db.Float, nullable=False)
    bIsDeleted = db.Column(db.Integer, nullable=False)
    dtUpdateDate = db.Column(db.TIMESTAMP, default=datetime.utcnow)
    dtInsertDate = db.Column(db.TIMESTAMP, default=datetime.utcnow)

    def to_json(self):
        return {'aID': self.aID, 'vchStateName': self.vchStateName, 'vchStateAbbr': self.vchStateAbbr, 'fTaxRate': self.fTaxRate, 'bIsDeleted': self.bIsDeleted, 'dtUpdateDate': self.dtUpdateDate, 'dtInsertDate': self.dtInsertDate}

class Followers(db.Model):
    __tablename__ = 'followers'
    aID = db.Column(db.Integer, primary_key=True, autoincrement=True)
    nUserID = db.Column(db.Integer, db.ForeignKey('users.aID'), nullable=False)
    nFollowingID = db.Column(db.Integer, db.ForeignKey('users.aID'), nullable=False)
    dtUpdateDate = db.Column(db.TIMESTAMP, default=datetime.utcnow)
    dtInsertDate = db.Column(db.TIMESTAMP, default=datetime.utcnow)

    def to_json(self):
        return {'aID': self.aID, 'nUserID': self.nUserID, 'nFollowingID': self.nFollowingID, 'dtUpdateDate': self.dtUpdateDate, 'dtInsertDate': self.dtInsertDate}
    
class Tracks(db.Model):
    __tablename__ = 'tracks'
    aID = db.Column(db.Integer, primary_key=True, autoincrement=True)
    nAuthorID = db.Column(db.Integer, db.ForeignKey('users.aID'), nullable=False)
    vchTitle = db.Column(db.String(255), nullable=False)
    vchDescription = db.Column(db.String(255), nullable=True)
    vchAudioURL = db.Column(db.String(255), nullable=False)
    vchImagePath = db.Column(db.String(255), nullable=True)
    dtUpdateDate = db.Column(db.TIMESTAMP, default=datetime.utcnow)
    dtInsertDate = db.Column(db.TIMESTAMP, default=datetime.utcnow)

    def to_json(self):
        return {'aID': self.aID, 'nAuthorID': self.nAuthorID, 'vchTitle': self.vchTitle, 'vchDescription': self.vchDescription, 'vchAudioURL': self.vchAudioURL, 'vchImagePath': self.vchImagePath, 'dtUpdateDate': self.dtUpdateDate, 'dtInsertDate': self.dtInsertDate}
   
class StoreFollowers(db.Model):
    __tablename__ = 'storefollowers'
    aID = db.Column(db.Integer, primary_key=True, autoincrement=True)
    nUserID = db.Column(db.Integer, db.ForeignKey('users.aID'), nullable=False)
    nStoreID = db.Column(db.Integer, db.ForeignKey('storefronts.aID'), nullable=False)
    dtUpdateDate = db.Column(db.TIMESTAMP, default=datetime.utcnow)
    dtInsertDate = db.Column(db.TIMESTAMP, default=datetime.utcnow)

    def to_json(self):
        return {'aID': self.aID, 'nUserID': self.nUserID, 'nStoreID': self.nStoreID, 'dtUpdateDate': self.dtUpdateDate, 'dtInsertDate': self.dtInsertDate}
 
class Addresses(db.Model):
    __tablename__ = 'addresses'
class Tracks(db.Model):
    __tablename__ = 'tracks'
    aID = db.Column(db.Integer, primary_key=True, autoincrement=True)
    nAuthorID = db.Column(db.Integer, db.ForeignKey('users.aID'), nullable=False)
    vchTitle = db.Column(db.String(255), nullable=False)
    vchDescription = db.Column(db.String(255), nullable=True)
    vchAudioURL = db.Column(db.String(255), nullable=False)
    vchImagePath = db.Column(db.String(255), nullable=True)
    dtUpdateDate = db.Column(db.TIMESTAMP, default=datetime.utcnow)
    dtInsertDate = db.Column(db.TIMESTAMP, default=datetime.utcnow)

    def to_json(self):
        return {'aID': self.aID, 'nAuthorID': self.nAuthorID, 'vchTitle': self.vchTitle, 'vchDescription': self.vchDescription, 'vchAudioURL': self.vchAudioURL, 'vchImagePath': self.vchImagePath, 'dtUpdateDate': self.dtUpdateDate, 'dtInsertDate': self.dtInsertDate}
   
class StoreFollowers(db.Model):
    __tablename__ = 'storefollowers'
    aID = db.Column(db.Integer, primary_key=True, autoincrement=True)
    nUserID = db.Column(db.Integer, db.ForeignKey('users.aID'), nullable=False)
    nStoreID = db.Column(db.Integer, db.ForeignKey('storefronts.aID'), nullable=False)
    dtUpdateDate = db.Column(db.TIMESTAMP, default=datetime.utcnow)
    dtInsertDate = db.Column(db.TIMESTAMP, default=datetime.utcnow)

    def to_json(self):
        return {'aID': self.aID, 'nUserID': self.nUserID, 'nStoreID': self.nStoreID, 'dtUpdateDate': self.dtUpdateDate, 'dtInsertDate': self.dtInsertDate}
 
class Addresses(db.Model):
    __tablename__ = 'addresses'
    aID = db.Column(db.Integer, primary_key=True, autoincrement=True)
    nUserID = db.Column(db.Integer, db.ForeignKey('users.aID'), nullable=False)
    vchAddress1 = db.Column(db.String(45), nullable=True)
    vchAddress2 = db.Column(db.String(45), nullable=True)
    vchCity = db.Column(db.String(45), nullable=True)
    nStateID = db.Column(db.Integer, db.ForeignKey('states.aID'), nullable=True)
    vchZIP = db.Column(db.String(45), nullable=True)
    nCountryID = db.Column(db.Integer, db.ForeignKey('countries.aID'), nullable=True)
    bIsActive = db.Column(db.Integer, nullable=False)
    bIsDeleted = db.Column(db.Integer, nullable=False)
    dtUpdateDate = db.Column(db.TIMESTAMP, default=datetime.utcnow)
    dtInsertDate = db.Column(db.TIMESTAMP, default=datetime.utcnow)

    def to_json(self):
        return {'aID': self.aID, 'nUserID': self.nUserID, 'vchAddress1': self.vchAddress1, 'vchAddress2': self.vchAddress2, 'vchCity': self.vchCity, 'nStateID': self.nStateID, 'vchZIP': self.vchZIP, 'nCountryID': self.nCountryID, 'bIsActive': self.bIsActive, 'bIsDeleted': self.bIsDeleted, 'dtUpdateDate': self.dtUpdateDate, 'dtInsertDate': self.dtInsertDate}

        return {'aID': self.aID, 'nUserID': self.nUserID, 'vchAddress1': self.vchAddress1, 'vchAddress2': self.vchAddress2, 'vchCity': self.vchCity, 'nStateID': self.nStateID, 'vchZIP': self.vchZIP, 'nCountryID': self.nCountryID, 'bIsActive': self.bIsActive, 'bIsDeleted': self.bIsDeleted, 'dtUpdateDate': self.dtUpdateDate, 'dtInsertDate': self.dtInsertDate}

class Orders(db.Model):
    __tablename__ = 'orders'
    aID = db.Column(db.Integer, primary_key=True, autoincrement=True)
    nUserID = db.Column(db.Integer, db.ForeignKey('users.aID'), nullable=False)
    nItemCount = db.Column(db.Integer, nullable=False)
    fCostTotal = db.Column(db.Float, nullable=False)
    fTaxTotal = db.Column(db.Float, nullable=False)
    fShippingTotal = db.Column(db.Float, nullable=False)
    fGrandTotal = db.Column(db.Float, nullable=False)
    bIsPaid = db.Column(db.Integer, nullable=False)
    nCCInfoID = db.Column(db.Integer, db.ForeignKey('ccinfo.aID'), nullable=False)
    nShippingAddressID = db.Column(db.Integer, db.ForeignKey('addresses.aID'), nullable=False)
    nBillingAddressID = db.Column(db.Integer, db.ForeignKey('addresses.aID'), nullable=False)
    bIsShipped = db.Column(db.Integer, nullable=False)
    bIsCanceled = db.Column(db.Integer, nullable=False)
    dtUpdateDate = db.Column(db.TIMESTAMP, default=datetime.utcnow)
    dtInsertDate = db.Column(db.TIMESTAMP, default=datetime.utcnow)

    def to_json(self):
        return {'aID': self.aID, 'nUserID': self.nUserID, 'nItemCount': self.nItemCount, 'fCostTotal': self.fCostTotal, 'fTaxTotal': self.fTaxTotal, 'fGrandTotal': self.fGrandTotal, 'bIsPaid': self.bIsPaid, 'nCCInfoID': self.nCCInfoID, 'nShippingAddressID': self.nShippingAddressID, 'nBillingAddressID': self.nBillingAddressID, 'bIsShipped': self.bIsShipped, 'bIsCanceled': self.bIsCanceled, 'dtUpdateDate': self.dtUpdateDate, 'dtInsertDate': self.dtInsertDate}

class OrderItems(db.Model):
    __tablename__ = 'orderitems'
class OrderItems(db.Model):
    __tablename__ = 'orderitems'
    aID = db.Column(db.Integer, primary_key=True, autoincrement=True)
    nOrderID = db.Column(db.Integer, db.ForeignKey('orders.aID'), nullable=False)
    nProductID = db.Column(db.Integer, db.ForeignKey('products.aID'), nullable=False)
    nQuantity = db.Column(db.Integer, nullable=False)
    fPrice = db.Column(db.Float, nullable=False)
    dtUpdateDate = db.Column(db.TIMESTAMP, default=datetime.utcnow)
    dtInsertDate = db.Column(db.TIMESTAMP, default=datetime.utcnow)

    def to_json(self):
        return {'aID': self.aID, 'nOrderID':self.nOrderID, 'nProductID': self.nProductID, 'nQuantity': self.nQuantity, 'fPrice': self.fPrice, 'dtUpdateDate': self.dtUpdateDate, 'dtInsertDate': self.dtInsertDate} 
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
#listen to track music by id
@app.route('/api/flask/listen/<int:track_id>'), methods=['GET'])
def listen_to_music(track_id):
    try:
        track = Tracks.query.get(track_id)
        if track:
            return jsonify({'message'}: 'Listening to track'), 'track': track.to.json()}), 200
        else:
            return jsonify({'message'}: 'Track not found'}), 404
    except Exception as e:
        return jsonify({'message': 'Error listening to music', 'error': str(e)}), 500

#search for music
@app.route('/api/flask/listen', methods=['GET'])
def search_music():
    try:
        query = request.args.get('query')
        if query:
            tracks = Tracks.query.filter(Tracks.vchTitle.ilike(f'%{query}%')).all()
            if tracks:
                tracks_json = [track.to_json() for track in tracks]
                return jsonify({'message': 'Search results', 'results': tracks_json}), 200
            else:
                return jsonify({'message': 'No results found'}), 404
        else:
            return jsonify({'message': 'Missing query'}), 400
    except Exception as e:
        return jsonify({'message': 'Error searching music', 'error': str(e)}), 500 
'''