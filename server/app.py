'''
    app.py

    REST endpoints for application:

'''

""" ------------------------- Imports ------------------------- """

from datetime import datetime
from flask import Flask, request, redirect, jsonify, send_from_directory, url_for
from werkzeug.utils import secure_filename
from flask import request, jsonify, make_response
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData, and_, or_, not_, Column, Integer, ForeignKey
from sqlalchemy.orm import relationship
from flask_mail import Mail, Message
from itsdangerous import URLSafeTimedSerializer as Serializer
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
import sys
from os.path import exists
import os
import traceback



""" ------------------------- Setup ------------------------- """

app = Flask(__name__)
CORS(app) 
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqlconnector://root:password123@localhost/cloudsound'
#app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///cloud.db'
app.config['SQLALCHEMY_TRACK_NOTIFICATIONS'] = False
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USE_SSL'] = False
app.config['MAIL_USERNAME'] = 'tyleramoquin@gmail.com'
app.config['MAIL_PASSWORD'] = 'ebqw zghs cqus vfyi'

backend = 'http://127.0.0.1:5000'

UPLOAD_FOLDER = os.path.join(os.getcwd(), 'uploads')
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

ALLOWED_EXTENSIONS = {"image": ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'mp4', 'mov', 'mp3', 'wav', 'm4a', 'flac'],
                        "audio": ['mp3', 'wav', 'm4a', 'flac'],}

app.config['SECRET_KEY'] = 'beneaththeradar'
app.config['SECURITY_PASSWORD_SALT'] = b'77'

mail = Mail(app)

""" ------------------------- Database Setup ------------------------- """

db = SQLAlchemy(app)

meta = db.MetaData()

with app.app_context():
    db.reflect()

class Addresses(db.Model):
    __table__ = db.metadata.tables['Addresses']

class BanRequests(db.Model):
    __table__ = db.metadata.tables['BanRequests']

class Cart(db.Model):
    __table__ = db.metadata.tables['Cart']

class Followers(db.Model):
    __table__ = db.metadata.tables['Followers']

class Genres(db.Model):
    __table__ = db.metadata.tables['Genres']

class OrderItems(db.Model):
    __table__ = db.metadata.tables['OrderItems']

class Orders(db.Model):
    __table__ = db.metadata.tables['Orders']

class Products(db.Model):
    __table__ = db.metadata.tables['Products']

class Report(db.Model):
    __table__ = db.metadata.tables['Reports']

class StoreFollowers(db.Model):
    __table__ = db.metadata.tables['StoreFollowers']

class Stores(db.Model):
    __table__ = db.metadata.tables['Stores']

class Tracks(db.Model):
    __table__ = db.metadata.tables['Tracks']

class Users(db.Model):
    __table__ = db.metadata.tables['Users']

tables = {
    'Addresses': Addresses(),
    'Followers': Followers(),
    'Genres': Genres(),
    'OrderItems': OrderItems(),
    'Orders': Orders(),
    'Products': Products(),
    'StoreFollowers': StoreFollowers(),
    'Stores': Stores(),
    'Tracks': Tracks(),
    'Users': Users(),
}


""" ------------------------- Helper Functions ------------------------- """

def allfields(name, item):
    return {col: getattr(item, col) for col in tables[name].__table__.columns.keys()}

def allowed_file(filename, type):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS[type]



""" ------------------------- User Endpoints ------------------------- """

#get all users
@app.route('/user/all', methods=['GET'])
def get_users():
    try:
        users = Users.query.all()
        users_data = [{'id': user.aID, 'username': user.vchUsername, 'email': user.vchEmail} for user in users]
        return jsonify(users_data), 200
    except Exception as e:
        return make_response(jsonify({'message': 'error getting users', 'error':str(e)}), 500)
    

# create user
@app.route('/user/create', methods=['POST'])
def do_create_user():
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

        return make_response(jsonify(allfields('Users', new_user)), 201)
    
    except Exception as e:
        return make_response(jsonify({'message': 'Error creating user', 'error': str(e)}), 500)
    
#get user by id
@app.route('/user/<int:user_id>', methods=['GET'])
def do_user_get(user_id):
    try:
        UsersTable = Users()
        TracksTable = Tracks()
        users = UsersTable.query.filter_by(aID=user_id)
        users_data = [allfields('Users', user) for user in users] if users else []
        tracks = TracksTable.query.filter_by(nArtistID=user_id)
        tracks_data = [allfields('Tracks', track) for track in tracks] if tracks else []
        resp = {
            'user': users_data[0],
            'tracks': tracks_data,
        }
        with open('debug.log', 'w') as f:
            print(resp, file=f)
        return make_response(jsonify(resp), 200)
    except Exception as e:
        return make_response(str(e), 500)

# get all data of user by id
@app.route('/user/data/<int:user_id>', methods=['GET'])
def get_data_user_by_id(user_id):
    try:
        #try to get the user by its id
        user = Users.query.filter_by(aID=user_id).first()
        if user:
            store = Stores.query.filter_by(nUserID=user_id).first()
            if store:
                tracks = Tracks.query.filter_by(nAuthorID=user_id).all()
                tracks_data = [{
                    'trackID' : track.aID,
                    'trackTitle': track.vchTitle,
                    'trackDescription': track.txtDescription
                } for track in tracks]
                if tracks:
                    followers = Followers.query.filter_by(nFollowingID=user_id).count()
                    following = Followers.query.filter_by(nUserID=user_id).count()
                    if followers >=0 and following >=0:
                        user_data = {
                            'userId': user.aID,
                            'username': user.vchUsername,
                            'bio': user.txtBio,
                            'storeID': store.aID,
                            'storeName': store.vchName,
                            'storeDescription': store.txtDescription,
                            'followerCount': followers,
                            'followingCount': following,
                            'tracksData': tracks_data
                        }
                        return make_response(jsonify(user_data), 200)
                    return make_response(jsonify({'message': 'error getting following and followers'}), 500)
            return make_response(jsonify({'message': 'error getting tracks'}), 500)
        return make_response(jsonify({'message': 'error getting store'}), 500)
    except Exception as e:
        return make_response(jsonify({'message': 'error getting user', 'error':str(e)}), 500)

@app.route('/user/follow', methods=['POST'])
def do_user_follow():
    try:
        # get any users being followed by the user
        data = request.get_json()
        user_id = data['nUserID']
        follow_id = data['nFollowingID']
        following = Followers().query.filter_by(nUserID=user_id).all()
        recs = [follow.nFollowingID for follow in following] if following else []

        if (follow_id not in recs):
            new_follow = Followers(
                nUserID=user_id,
                nFollowingID=follow_id,
            )
            db.session.add(new_follow)
            db.session.commit()
        recs = Followers().query.filter_by(nUserID=user_id).all()
        following_ids = [follow.nFollowingID for follow in recs]
        users = Users().query.filter(Users.aID.in_(following_ids)).all()
        return make_response(jsonify([allfields('Users', user) for user in users]), 201)
    except Exception as e:
        return make_response(jsonify({'message': 'error following user', 'request':request.get_json(), 'error': str(e)}), 500)

@app.route('/user/unfollow', methods=['POST'])
def do_user_unfollow():
    try:
        # get any users being followed by the user
        data = request.get_json()
        user_id = data['nUserID']
        follow_id = data['nFollowingID']
        following = Followers().query.filter(and_(Followers.nUserID==user_id, Followers.nFollowingID==follow_id)).all()

        if following:
            following.delete()
            db.session.commit()
        recs = Followers().query.filter_by(nUserID=user_id).all()
        following_ids = [follow.nFollowingID for follow in recs]
        users = Users().query.filter(Users.aID.in_(following_ids)).all()
        return make_response(jsonify([allfields('Users', user) for user in users]), 201)
    except Exception as e:
        return make_response(jsonify({'message': 'error following user', 'error': str(e)}), 500)
    



""" ------------------------- Store Endpoints ------------------------- """

# create store
@app.route('/store/create', methods=['POST'])
def do_store_create():
    s = None
    try:
        data = request.get_json()
        s = Stores(
            nUserID=data['nUserID'],
            vchName=data['vchName'],
            txtDescription=data['txtDescription']
        )
        db.session.add(s)
        db.session.commit()
        return make_response(jsonify(allfields('Stores', s)), 201)
    except Exception as e:
        return make_response(jsonify({'message': 'store not created', 'error':str(e), 'data':data}), 500)
    
#get all stores
@app.route('/store/all', methods=['GET'])
def get_stores():
    try:
        stores = Stores.query.all()
        stores_data = [{'id': store.aID, 'name': store.vchName, 'user': store.nUserID, 'txtDescription':store.txtDescription} for store in stores]
        return jsonify(stores_data), 200
    except Exception as e:
        return make_response(jsonify({'message': 'error getting users', 'error':str(e)}), 500)

# update store
@app.route('/store/update', methods=['POST'])
def do_store_update():
    data = request.get_json()
    try:
        s = Stores().query.filter_by(aID=data['aID']).first()
        if s:
            s.nUserID = data['nUserID']
            s.vchName = data['vchName']
            s.txtDescription = data['txtDescription']
            db.session.commit()
            return make_response(jsonify(allfields('Stores', s)), 201)
        return make_response(jsonify({'message': 'store not found'}), 404)
    except Exception as e:
        return make_response(jsonify({'message': 'store not updated', 'error':str(e),'data':data}), 500)
    
#get store by id 
@app.route('/storefront/<int:store_id>', methods=['GET'])
def get_store_by_id(store_id):
    try:
        #try to get the store by its id
        store = Stores.query.filter_by(aID=store_id).first()
        if store:
            store_data ={
                'id': store.aID,
                'ownerID': store.nUserID,
                'name' : store.vchName,
                'description' : store.txtDescription
            }
            return make_response(jsonify(store_data), 200)
        return make_response(jsonify({'message': 'store not found'}), 404)
    except Exception as e:
        return make_response(jsonify({'message': 'error getting store', 'error':str(e)}), 500)
    
#get store by id with owner name
@app.route('/storefront/owner/<int:store_id>', methods=['GET'])
def get_store_with_owner(store_id):
    try:
        #try to get the store by its id
        store = Stores.query.filter_by(aID=store_id).first()
        if store:
            ownerID = store.nUserID
            if ownerID:
                ownerName = Users.query.filter_by(aID=ownerID).first()
                if ownerName:
                    store_data = {
                        'id': store.aID,
                        'ownerID': store.nUserID,
                        'name' : store.vchName,
                        'description' : store.txtDescription,
                        'ownerName': ownerName.vchUsername,
                    }
                    return make_response(jsonify(store_data), 200)
                return make_response(jsonify({'message' : 'owner not found'}), 404)
        return make_response(jsonify({'message': 'store not found'}), 404)
    except Exception as e:
        return make_response(jsonify({'message': 'error getting store', 'error':str(e)}), 500)


""" ------------------------- Product Endpoints ------------------------- """

    
@app.route('/products/<int:store_id>', methods=['GET'])
def do_products_by_store(store_id):
    try:
        products = Products().query.filter_by(nStoreID=store_id).all()
        products_data = [allfields('Products', product) for product in products] if products else []        
        return make_response(jsonify(products_data), 200)
    except Exception as e:
        return make_response(jsonify({'message': 'error getting products', 'error': str(e)}), 500)

# add product
@app.route('/product/add', methods=['POST'])
def do_product_add():
    response = {}
    try:
        data = request.get_json()
        storeID = data['nStoreID']
        p = Products(
            nStoreID=data['nStoreID'],
            vchName=data['vchName'],
            txtDescription=data['txtDescription'],
            fPrice=data['fPrice'],
            fShipping=data['fShipping'],
            nInventory=data['nInventory'],
            vchImagePath=data['vchImagePath']
        )
        db.session.add(p)
        db.session.commit()
        productsTable = Products()
        products = productsTable.query.filter_by(nStoreID=storeID).all()
        response['products'] = [allfields('Products', product) for product in products] if products else []
        return make_response(jsonify(response), 201)
    except Exception as e:
        return make_response(jsonify({'message': 'product not added', 'error':str(e), 'response':response}), 500)


# delete product
@app.route('/product/delete', methods=['POST'])
def do_product_delete():
    response = {}
    try:
        data = request.get_json()
        storeID = data['nStoreID']
        p = Products().query.filter_by(aID=data['aID']).first()
        if p:
            db.session.delete(p)
            db.session.commit()
            productsTable = Products()
            products = productsTable.query.filter_by(nStoreID=storeID).all()
            response['products'] = [allfields('Products', product) for product in products] if products else []
            return make_response(jsonify(response), 200)
        return make_response(jsonify({'message': 'product not found'}), 404)
    except Exception as e:
        return make_response(jsonify({'message': 'product not deleted', 'error':str(e), 'response':response}), 500)


# update products
@app.route('/product/update', methods=['POST'])
def do_product_update():
    data = request.get_json()
    id = int(data['aID'])
    where = 'top'
    try:
        productsTable = Products()
        s = productsTable.query.filter_by(aID=id).first()
        where = 'mid'
        if s:
            s.vchName = data['vchName']
            s.txtDescription = data['txtDescription']
            s.fPrice = data['fPrice']
            s.fShipping = data['fShipping']
            s.nInventory = data['nInventory']
            s.vchImagePath = data['vchImagePath']
            db.session.commit()
        products = productsTable.query.filter_by(nStoreID=s.nStoreID).all()
        response = [allfields('Products', product) for product in products] if products else []
        return make_response(jsonify(response), 201)
    except Exception as e:
        return make_response(jsonify({'message': 'product not updated', 'error':str(e),'data':data, 'id':id}), 501)
    
@app.route('/product/image/upload', methods=['POST'])
def do_product_image_upload():
    response = {}
    try:
        file = request.files['file']
        filename = secure_filename(file.filename)
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        storeID = request.form['nStoreID']
        aID = request.form['aID']
        vchFilename = request.form['vchFilename']
        p = Products().query.filter_by(aID=aID).first()
        p.vchImagePath = filename
        db.session.commit()
        products = Products().query.filter_by(nStoreID=storeID).all()
        response = {}
        response['products'] = [allfields('Products', product) for product in products] if products else []
        return make_response(jsonify(response), 201)
    except Exception as e:
        return make_response(jsonify({'message': 'product image not added', 'error':str(e), 'response':response}), 500)




""" ------------------------- Cart Endpoints ------------------------- """

#add product to cart
@app.route('/cart/add', methods=['POST'])
def add_to_cart():
    try:
         
         data = request.get_json()
         cart_item = Cart.query.filter_by(nUserID=data['userId']).filter_by(nActive=1).filter_by(nProductID=data['productId']).first()
         
         if cart_item:
            cart_item.nQuantity += 1
         else:
            cart_item = Cart(
                nUserID= data['userId'],
                nStoreID= data['storeId'],
                nProductID= data['productId'],
                nQuantity= data['nQuantity'],
                nActive=data['nActive']
            )

         db.session.merge(cart_item)
         db.session.commit()

         return make_response(jsonify({
             'aID': cart_item.aID,
             'nUserID': cart_item.nUserID,
             'nStoreID': cart_item.nStoreID,
             'nProductID': cart_item.nProductID,
             'nQuantity': cart_item.nQuantity,
             'nActive': cart_item.nActive
         }), 201)
    except Exception as e:
         return make_response(jsonify({'message': 'Product not added', 'error': str(e), 'response': response}), 500)

#get cart all by user id
@app.route('/cart/<int:user_id>', methods=['GET'])
def get_cart_by_user(user_id):
     try:
         # Query cart items by user ID
         cart_items = Cart.query.filter_by(nUserID=user_id).filter_by(nActive=1).all()

         # Initialize an empty list to store formatted cart items
         formatted_cart_items = []

         # Iterate over each cart item
         for cart_item in cart_items:
             # Get the product associated with the cart item
             product = Products.query.get(cart_item.nProductID)
             if product:
                 # Get the store associated with the product
                 store = Stores.query.get(product.nStoreID)
                 if store:
                     # Create a dictionary representing the formatted cart item
                     formatted_cart_item = {
                         'cart_id': cart_item.aID,
                         'user_id': cart_item.nUserID,
                         'product_id': cart_item.nProductID,
                         'store_id': cart_item.nStoreID,
                         'quantity': cart_item.nQuantity,
                         'product_name': product.vchName,  # Include product name
                         'store_name': store.vchName,  # Include store name
                         'product_price': product.fPrice,
                         'shipping_cost': product.fShipping
                     }
                     # Append the formatted cart item to the list
                     formatted_cart_items.append(formatted_cart_item)

         # Return the formatted cart items as JSON response
         return jsonify(formatted_cart_items), 200
     except Exception as e:
         return make_response(jsonify({'message': 'Error getting cart items', 'error': str(e)}), 500)

#delete cart item by cart aid
@app.route('/cart/delete-item', methods=['POST'])
def delete_cart():
     response = {}
     try:
         data = request.get_json()
         item = Cart.query.filter_by(nUserID=data['userId']).filter_by(nActive=1).filter_by(nProductID=data['productId']).first()
         if item:
             db.session.delete(item)
             db.session.commit()
             return make_response(jsonify({'message': 'Item deleted successfully'}), 200)
         return make_response(jsonify({'message': 'Item not found'}), 404)
     except Exception as e:
         return make_response(jsonify({'message': 'Item not deleted', 'error': str(e)}), 500)

@app.route('/checkout/shipping_address', methods=['POST'])
def store_shipping_addr():
    data = request.get_json()
    try:
        addresses = Addresses()
        try:
            a = addresses.query.filter_by(vchAddress1=data['shipAddr']).first()
        except Exception as e:
            return make_response(jsonify({'message': 'address storage unsuccessful', 'error':str(e)}), 500)
        if a:
            return make_response(jsonify({'message': 'address already exists'}), 200)
        else:
            a = Addresses(
                vchAddress1=data['shipAddr'],
                vchCity=data['shipCity'],
                nStateID=data['shipCity'],
                vchZip=data['shipZip'],
            )
            db.session.add(a)
            db.session.commit()
            return jsonify({
                'aID': a.aID,
                'vchAddress1': a.vchAddress1,
                'vchCity': a.vchCity,
                'nStateID': a.nStateID,
                'vchZip': a.vchZip,
            }), 201
    except Exception as e:
        return make_response(jsonify({'message': 'address storage unsuccessful', 'error':str(e), 'data':data}), 500)
    
@app.route('/checkout/billing_address', methods=['POST'])
def store_billing_addr():
    data = request.get_json()
    try:
        addresses = Addresses()
        try:
            a = addresses.query.filter_by(vchAddress1=data['shipAddr']).first()
        except Exception as e:
            return make_response(jsonify({'message': 'address storage unsuccessful', 'error':str(e)}), 500)
        if a:
            return make_response(jsonify({'message': 'address already exists'}), 200)
        else:
            a = Addresses(
                vchAddress1=data['billAddr'],
                vchCity=data['billCity'],
                nStateID=data['billCity'],
                vchZip=data['billZip'],
            )
            db.session.add(a)
            db.session.commit()
            return jsonify({
                'aID': a.aID,
                'vchAddress1': a.vchAddress1,
                'vchCity': a.vchCity,
                'nStateID': a.nStateID,
                'vchZip': a.vchZip,
            }), 201
    except Exception as e:
        return make_response(jsonify({'message': 'address storage unsuccessful', 'error':str(e), 'data':data}), 500)




""" ------------------------- Track Endpoints ------------------------- """

#search for track/music
@app.route('/track', methods=['GET'])
def do_track_search():
    try:
        query = request.args.get('query')
        if query:
            tracks = Tracks().query.filter(Tracks.vchTitle.ilike(f'%{query}%')).all()
            if tracks:
                tracks_json = [track.to_json() for track in tracks]
                return make_response(jsonify({'message': 'Search results', 'results': tracks_json}), 200)
            else:
                return make_response(jsonify({'message': 'No results found'}), 404)
        else:
            return make_response(jsonify({'message': 'Missing query'}), 400)
    except Exception as e:
        return make_response(jsonify({'message': 'Error searching music', 'error': str(e)}), 500)
    
# get all tracks
@app.route('/tracks/all', methods=['GET'])
def get_tracks():
    try:
        tracks = Tracks.query.all()
        tracks_data = [{'id': track.aID, 'author': track.nAuthorID, 'title':track.vchTitle, 'description':track.txtDescription, 'audio':track.vchAudioURL, 'genre':track.nGenreID } for track in tracks]
        return jsonify(tracks_data), 200
    except Exception as e:
        return make_response(jsonify({'message': 'error getting users', 'error':str(e)}), 500)

#listen to track/music by id
@app.route('/track/<int:track_id>', methods=['GET'])
def do_track_get(track_id):
    try:
        track = Tracks().query.get(track_id)
        if track:
            return make_response(jsonify({'message': 'Listening to track', 'track': track.to.json()}), 200)
        else:
            return make_response(jsonify({'message': 'Track not found'}), 404)
    except Exception as e:
        return make_response(jsonify({'message': 'Error listening to music', 'error': str(e)}), 500)

@app.route('/track/upload', methods=['POST'])
def do_track_upload():
    if 'files' not in request.files:
        return make_response(jsonify({'error': 'No file part'}), 400)
    files = request.files.getlist('files')
    if not files or files[0].filename == '':
        return make_response(jsonify({'error': 'No selected file'}), 400)

    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

    for file in files:
        if file and allowed_file(file.filename):
            # make filename unique, checking if it already exists
            if os.path.exists(os.path.join(app.config['UPLOAD_FOLDER'], file.filename)):
                filename = secure_filename(file.filename)
                # get the file and its extension
                filename, file_extension = os.path.splitext(filename)
                filename = f"{filename}_{datetime.now().strftime('%Y%m%d%H%M%S')}{file_extension}"
                file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            else:
                filename = secure_filename(file.filename)
                file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))

    return make_response(jsonify({'message': 'Files successfully uploaded', 'filename':filename}), 200)

@app.route('/track/upload/link', methods=['POST'])
def do_track_upload_link():
    try:
        data = request.get_json()
        track = Tracks(
            nUserID=data['nUserID'],
            nArtistID=data['nArtistID'],
            vchTitle=data['vchTitle'],
            txtDescription=data['txtDescription'],
            vchAudioURL=data['vchAudioURL'],
            nGenreID=data['nGenreID'],
        )
        db.session.add(track)
        db.session.commit()
        response = {}
        tracks = Tracks().query.filter_by(nArtistID=data['nArtistID']).all()
        response['music'] = [allfields('Tracks', track) for track in tracks] if tracks else []
        return make_response(jsonify(response), 201)
    except Exception as e:
        return make_response(jsonify({'message': 'Error uploading track', 'error': str(e)}), 500)
    

# delete track
@app.route('/delete-track', methods=['POST'])
def delete_track():
    response = {}
    try:
        data = request.get_json()
        userID = data['nUserID']

        t = Tracks.query.filter_by(aID=data['aID']).first()
        if t:
            db.session.delete(t)
            db.session.commit()
            tracksTable = Tracks()
            tracks = tracksTable.query.filter_by(nAuthorID=userID).all()
            response['tracks'] = [{
                'aID': track.aID,
                'nAuthorID': track.nAuthorID,
                'vchTitle': track.vchTitle,
                'txtDescription': track.txtDescription,
                'vchAudioURL': track.vchAudioURL,
                'vchImagePath': track.vchImagePath,
                'nGenreID': track.nGenreID,
            } for track in tracks] if tracks else []
            return make_response(jsonify(response), 200)
        return make_response(jsonify({'message': 'track not found'}), 404)
    except Exception as e:
        return make_response(jsonify({'message': 'track not deleted', 'error':str(e), 'response':response}), 500)


""" ------------------------- Image Endpoints ------------------------- """

@app.route('/image/upload', methods=['POST'])
def do_upload_image():
    if 'files' not in request.files:
        return make_response(jsonify({'error': 'No file part'}), 400)

    files = request.files.getlist('files')  # Get the list of files from the 'files' part
    if not files or files[0].filename == '':
        return make_response(jsonify({'error': 'No selected file'}), 400)

    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

    for file in files:
        if file and allowed_file(file.filename):
            # make filename unique, checking if it already exists
            if os.path.exists(os.path.join(app.config['UPLOAD_FOLDER'], file.filename)):
                filename = secure_filename(file.filename)
                # get the file and its extension
                filename, file_extension = os.path.splitext(filename)
                filename = f"{filename}_{datetime.now().strftime('%Y%m%d%H%M%S')}{file_extension}"
                file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            else:
                filename = secure_filename(file.filename)
                file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
    return make_response(jsonify({'filename':filename}), 200)


""" ------------------------- File Endpoints ------------------------- """

@app.route('/file/<path:filename>', methods=['GET'])
def do_file_get(filename):
    filepath = f'uploads/{filename}'
    #return make_response(jsonify({'message': filepath}), 200)
    #return make_response('foo',200)
    if exists(filepath):
        return send_from_directory('uploads', filename, as_attachment=False)
    else:
        return make_response(jsonify({'message': 'File not found'}), 404)
    

""" ------------------------- Login/Signup Endpoints ------------------------- """

# do login
@app.route('/login', methods=['POST'])
def do_login():
    data = request.get_json()
    try:
        usersTable = Users()
        storesTable = Stores()
        genresTable = Genres()
        productsTable = Products()
        ordersTable = Orders()
        tracksTable = Tracks()
        followersTable = Followers()
        ordersTable = Orders()
        orderItemsTable = OrderItems()

        try:
            u = usersTable.query.filter_by(vchUsername=data['username'], vchPassword=data['password']).first()
            user_id = u.aID
            response = {}
            if u.vchUsername == data['username'] and u.bIsVerified == 1:
                response['user'] = allfields('Users', u)

                try:
                    # get genres
                    genres = genresTable.query.all()
                    response['genres'] = [allfields('Genres', genre) for genre in genres] if genres else []
                except Exception as e:
                    response['genres'] = []

                try:
                    # get any store associated with the user
                    store = storesTable.query.filter_by(nUserID=user_id).first()
                    response['store'] = allfields('Stores', store) if store else {}
                except Exception as e:
                    response['store'] = {}

                try:
                    # get products associated with the store
                    products = productsTable.query.filter_by(nStoreID=store.aID).all()
                    response['products'] = [allfields('Products', product) for product in products] if products else []
                except Exception as e:
                    response['products'] = []

                try:
                    # get orders for store associaed with this user
                    orders = ordersTable.query.filter_by(nUserID=user_id).all()
                    response['orders'] = [allfields('Orders', order) for order in orders] if orders else []
                except Exception as e:
                    response['orders'] = []

                try:
                    # get any tracks associated with the user
                    tracks = tracksTable.query.filter((tracksTable.nUserID == user_id) & (tracksTable.nArtistID != user_id)).all()
                    if len(tracks) > 0:
                        response['tracks'] = [allfields('Tracks', track) for track in tracks] if tracks else []
                    else:
                        response['tracks'] = []
                    # for track in response['tracks']:
                    #     artist = usersTable.query.filter_by(aID=track['nUserID']).first()
                    #     track['vchAuthorName'] = f'{artist.vchFirstName} {artist.vchLastName}'
                except Exception as e:
                    response['tracks'] = ['error getting tracks']

                try:
                    # get any tracks in which user was the artist
                    music = tracksTable.query.filter_by(nArtistID=user_id).all()
                    response['music'] = [allfields('Tracks', track) for track in music] if music else []
                    # for track in response['music']:
                    #     artist = usersTable.query.filter_by(aID=track['nUserID']).first()
                    #     track['vchArtistName'] = f'{artist.vchFirstName} {artist.vchLastName}'
                except Exception as e:
                    response['music'] = ['error getting tracks']

                try:
                    # get any followers associated with the user
                    followers = followersTable.query.filter_by(nUserID=user_id).all()
                    response['followers'] = [allfields('Followers', follower) for follower in followers] if followers else []
                except Exception as e:
                    response['followers'] = []

                try:
                    # get any users being followed by the user
                    following = followersTable.query.filter_by(nFollowerID=user_id).all()
                    response['following'] = [allfields('Followers', follow) for follow in following] if following else []
                except Exception as e:
                    response['following'] = []

                try:
                    # get any orders associated with the user's store
                    orders = ordersTable.query.filter_by(nStoreID=response['store']['aID']).all()
                    response['orders'] = [allfields('Orders', order) for order in orders] if orders else []
                    # get any order items associated with the orders and add them to the response entries
                    for order in response['orders']:
                        items = orderItemsTable.query.filter_by(nOrderID=order.aID).all()
                        order.items = [allfields('OrderItems', item) for item in items] if items else []
                except Exception as e:
                    response['orders'] = []
                return make_response(jsonify(response), 200)
        except Exception as e:
            return make_response(jsonify({'message': 'login unsuccessful1', 'error':str(e)}), 500)
        return make_response(jsonify({'message': 'login unsuccessful2'}), 404)
    except Exception as e:
        return make_response(jsonify({'message': 'login unsuccessful3', 'error':str(e)}), 500)


# signup
@app.route('/signup', methods=['POST'])
def do_signup():
    def generate_verification_token(email):
        serializer = Serializer(app.config['SECRET_KEY'])
        return serializer.dumps(email, salt=app.config['SECURITY_PASSWORD_SALT'])

    data = request.get_json()
    try:
        try:
            u = Users().query.filter_by(vchUsername=data['username']).first()
        except Exception as e:
            return make_response(jsonify({'message': 'signup unsuccessful2', 'error':str(e)}), 500)
        if u:
            return make_response(jsonify({'message': 'username already exists'}), 409)
        else:
            u = Users()
            u.vchFirstName = data['firstName']
            u.vchLastName = data['lastName']
            u.vchUsername = data['username']
            u.vchPassword = data['password']
            u.vchEmail = data['email']
            u.vchProfilePicPath = data['filename']
            u.txtBio = data['bio']
            # send a verification email to the user with a link to /verify-email
            try:
                token = generate_verification_token(data['email'])
                u.vchToken = token
                db.session.add(u)
                db.session.commit()
            except Exception as e:
                e = e.with_traceback(sys.exc_info()[2])
                printedError = traceback.print_exception(type(e), e, e.__traceback__)
                return make_response(jsonify({'message': 'signup unsuccessful3 token', 'error':printedError, 'data':data}), 500)
            verify_url = f'http://127.0.0.1:3000/verify?token={token}'

            subject = 'Please Verify Your Email'
            sender = app.config['MAIL_USERNAME']
            recipients = [data['email']]
            body = f'Please click on the link to verify your email address: {verify_url}'
            msg = Message(subject=subject, sender=sender, recipients=recipients)
            msg.body = body
            # import code
            # code.interact(local=dict(globals(),**locals()))
            try:

            # Send the email
                mail.send(msg)
            except Exception as e:
                return make_response(jsonify({'message': 'signup unsuccessful3 mail', 'error':str(e), 'data':data}), 500)
            return make_response(jsonify(allfields('Users', u)), 201)
    except Exception as e:
        return make_response(jsonify({'message': 'signup unsuccessful3', 'error':str(e), 'data':data}), 500)




""" ------------------------- Verify Email Endpoints ------------------------- """

# verify email
@app.route('/verify/<token>', methods=['GET'])
def do_verify_token(token):
    def confirm_verification_token(token, expiration=3600):
        serializer = Serializer(app.config['SECRET_KEY'])
        try:
            email = serializer.loads(
                token,
                salt=app.config['SECURITY_PASSWORD_SALT'],
                max_age=expiration
            )
        except:
            return False
        return email

    try:
        email = confirm_verification_token(token)
        if email:
            user = Users().query.filter_by(vchEmail=email).first()
            if user:
                user.bIsVerified = True
                db.session.commit()
                return make_response(jsonify({'message': 'email verified'}), 200)
            return make_response(jsonify({'message': 'user not found'}), 404)
        return make_response(jsonify({'message': 'email not verified'}), 401)
    except Exception as e:
        return make_response(jsonify({'message': 'email not verified', 'error':str(e)}), 500)


""" ------------------------- Search Endpoints ------------------------- """

@app.route('/search/<q>', methods=['GET'])
def do_search(q):
    try:
        query = q
        response = {}
        if query:
            users = Users().query.filter(or_(Users.vchFirstName.ilike(f'%{query}%'), Users.vchLastName.ilike(f'%{query}%'), Users.txtBio.ilike(f'%{query}%'))).all()
            response["users"] = [allfields('Users', user) for user in users] if users else []
            tracks = Tracks().query.filter(Tracks.vchTitle.ilike(f'%{query}%')).all()
            response["tracks"] = [allfields('Tracks', track) for track in tracks] if tracks else []
            stores = Stores().query.filter(Stores.vchName.ilike(f'%{query}%')).all()
            response["stores"] = [allfields('Stores', store) for store in stores] if stores else []
            products = Products().query.filter(Products.vchName.ilike(f'%{query}%')).all()
            response["products"] = [allfields('Products', product) for product in products] if products else []
            return make_response(jsonify(response), 200)
        else:
            return make_response(jsonify({'message': 'Missing query'}), 400)
    except Exception as e:
        return make_response(jsonify({'message': 'Error searching', 'error': str(e)}), 500)





""" ------------------------- Report Endpoints ------------------------- """
    
#report user/product
@app.route('/api/report', methods=['POST'])
def handle_report():
    data = request.get_json()
    if not data:
        return jsonify({'message': 'No data provided'}), 400
    
    if 'reportType' not in data or 'description' not in data or 'identifier' not in data:
        return jsonify({'message': 'Missing required fields'}), 400
    
    new_report = Report(
        report_type=data['reportType'],
        description=data['description'],
        identifier=data['identifier']
    )

    db.session.add(new_report)
    db.session.commit()

    return jsonify({'message': 'Report received successfully'}), 201


""" ------------------------- Ban Endpoints ------------------------- """

#add ban
@app.route('/add-ban', methods=['POST'])
def add_ban():
    response = {}
    try:
        data = request.get_json()
        ban = BanRequests(
            nRequesterUserID=data['nRequesterUserID'],
            nRequestedUserID=data['nRequestedUserID'],
            vchReason=data['vchReason']
        )
        db.session.add(ban)
        db.session.commit()

        response['ban'] = {
            'aID': ban.aID,
            'nRequesterUserID': ban.nRequesterUserID,
            'nRequestedUserID': ban.nRequestedUserID,
            'vchReason': ban.vchReason,
            'dtRequested': ban.dtRequested.isoformat(),
            'dtResolved': ban.dtResolved.isoformat() if ban.dtResolved else None,
            'bResolved': ban.bResolved
         }

        return make_response(jsonify(response), 201)
    except Exception as e:
         return make_response(jsonify({'message': 'Ban not added', 'error': str(e), 'response': response}), 500)

#delete ban
@app.route('/delete-ban', methods=['POST'])
def delete_ban():
    response = {}
    try:
         data = request.get_json()
         ban_id = data['aID']
         ban = BanRequests.query.filter_by(aID=ban_id).first()
         if ban:
             db.session.delete(ban)
             db.session.commit()
             return make_response(jsonify({'message': 'Ban deleted successfully'}), 200)
         return make_response(jsonify({'message': 'Ban not found'}), 404)
    except Exception as e:
         return make_response(jsonify({'message': 'Ban not deleted', 'error': str(e)}), 500)

#get all bans
@app.route('/ban/all', methods=['GET'])
def get_bans():
    try:
         bans = BanRequests.query.all()  # 
         bans_data = [{
             'aID': ban.aID, 
             'vchReason': ban.vchReason, 
             'nRequesterUserID': ban.nRequesterUserID, 
             'nRequestedUserID': ban.nRequestedUserID, 
             'dtRequested': ban.dtRequested, 
             'bResolved': ban.bResolved} for ban in bans]
         return jsonify(bans_data), 200
    except Exception as e:
         return make_response(jsonify({'message': 'Error getting bans', 'error': str(e)}), 500)

#get bans by requester
@app.route('/bans/<int:requester_user_id>', methods=['GET'])
def get_bans_by_requester(requester_user_id):
    try:
         # Query bans by requester user ID
         bans = BanRequests.query.filter_by(nRequesterUserID=requester_user_id).all()

         # Convert bans to JSON format
         bans_data = [{
             'aID': ban.aID,
             'nRequesterUserID': ban.nRequesterUserID,
             'nRequestedUserID': ban.nRequestedUserID,
             'vchReason': ban.vchReason,
             'dtRequested': ban.dtRequested.isoformat(),
             'dtResolved': ban.dtResolved.isoformat() if ban.dtResolved else None,
             'bResolved': ban.bResolved
         } for ban in bans]

         return jsonify(bans_data), 200
    except Exception as e:
         return make_response(jsonify({'message': 'Error getting bans', 'error': str(e)}), 500)

#user update ban
@app.route('/user-update-ban', methods=['POST'])
def user_update_ban():
    data = request.get_json()
    try:
         ban = Users.query.filter_by(aID=data['aID']).first()
         if ban:
             # Update ban request fields
             ban.bIsBanned = data['bIsBanned']

             # Commit changes to the database
             db.session.commit()

             return make_response(jsonify({
                     'aID': ban.aID,
                     'vchUsername': ban.vchUsername,
                     'bIsBanned': ban.bIsBanned
             }), 200)
         return make_response(jsonify({'message': 'Ban request not found'}), 404)
    except Exception as e:
         return make_response(jsonify({'message': 'Ban request not updated', 'error': str(e), 'data': data}), 500)

#update ban
@app.route('/update-ban', methods=['POST'])
def update_ban():
    data = request.get_json()
    try:
         ban = BanRequests.query.filter_by(aID=data['aID']).first()
         if ban:
             # Update ban request fields
             ban.aID = data['aID']
             ban.dtResolved = data['dtResolved']
             ban.bResolved = data['bResolved']
             # Commit changes to the database
             db.session.commit()

             return make_response(jsonify({
                     'aID': ban.aID,
                     'nRequesterUserID': ban.nRequesterUserID,
                     'nRequestedUserID': ban. nRequestedUserID,
                     'dtResolved': ban.dtResolved,
                     'bResolved': ban.bResolved
             }), 200)
         return make_response(jsonify({'message': 'Ban request not found'}), 404)
    except Exception as e:
         return make_response(jsonify({'message': 'Ban request not updated', 'error': str(e), 'data': data}), 500)




""" ------------------------- Testing Endpoints ------------------------- """

@app.route('/check', methods=['GET'])
def do_check():
    try:
        items = Tracks().query.all()
        return make_response(jsonify({'message': 'check', 'meta':[allfields('Tracks', item) for item in items]}),200)
    except Exception as e:
        return make_response(jsonify({'message': 'error checking', 'error':str(e)}), 500)
     

#test route; must navigate to this url after activating 8080
@app.route('/home', methods=['GET'])
def get_contacts():
    data = {"message": "i'm in the api"}
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
                'txtBio': user.txtBio,
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



""" ------------------------- Run Server ------------------------- """
if __name__ == '__main__':
    app.run(debug=False, port=5000)