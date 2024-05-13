#, jsonify, make_response
from datetime import datetime
from flask import Flask, request, render_template
from flask import request, jsonify, make_response
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
# from models import app, db, Addresses, CCInfo, CCTypes, Countries, Followers, OrderItems, Orders, Products, States, StoreFollowers, Storefronts, Tracks, Users
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app) # enable cors for all routes
#url : mysql+mysqlconnector://username:password@localhost/db-name
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqlconnector://root:password123@localhost/cloudsound'
app.config['SQLALCHEMY_TRACK_NOTIFICATIONS'] = False
app.config['UPLOAD_FOLDER'] = "../data/"
ALLOWED_EXTENSIONS = set(['mp3', 'mp4', 'wav'])
db = SQLAlchemy(app)

with app.app_context():
    db.reflect()

class Addresses(db.Model):
    __table__ = db.metadata.tables['Addresses']

class BanRequests(db.Model):
    __table__ = db.metadata.tables['BanRequests']

class Cart(db.Model):
    __table__ = db.metadata.tables['Cart']

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

class Stores(db.Model):
    __table__ = db.metadata.tables['Stores']

class Tracks(db.Model):
    __table__ = db.metadata.tables['Tracks']

class Users(db.Model):
    __table__ = db.metadata.tables['Users']

class Report(db.Model):
    __table__ = db.metadata.tables['Reports']


### ------------- API ENDPOINTS ------------- ###

# do login
@app.route('/login', methods=['POST'])
def do_login():
    try:
        data = request.get_json()
        usersTable = Users()
        storesTable = Stores()
        productsTable = Products()
        ordersTable = Orders()
        tracksTable = Tracks()
        musicTable = Tracks()
        followersTable = Followers()
        ordersTable = Orders()
        orderItemsTable = OrderItems()

        try:
            u = usersTable.query.filter_by(vchUsername=data['username'], vchPassword=data['password']).first()
            response = {}
            if u.vchUsername == data['username'] and u.bIsBanned == 0:
                response['user'] = {
                    'aID': u.aID,
                    'vchUsername': u.vchUsername,
                    'vchEmail': u.vchEmail,
                    'vchPassword': u.vchPassword,
                    'vchFirstName': u.vchFirstName,
                    'vchLastName': u.vchLastName,
                    'bIsVerified': u.bIsVerified,
                    'txtBio': u.txtBio,
                    'vchProfilePicPath': u.vchProfilePicPath,
                    'bIsBanned': u.bIsBanned
                }

                try:
                    # get any store associated with the user
                    store = storesTable.query.filter_by(nUserID=u.aID).first()
                    response['store'] = {
                        'aID': store.aID,
                        'nUserID': store.nUserID,
                        'vchName': store.vchName,
                        'txtDescription': store.txtDescription
                    } if store else {}
                except Exception as e:
                    response['store'] = {}

                try:
                    # get products associated with the store
                    products = productsTable.query.filter_by(nStoreID=store.aID).all()
                    response['products'] = [{
                        'aID': product.aID,
                        'nStoreID': product.nStoreID,
                        'vchName': product.vchName,
                        'txtDescription': product.txtDescription,
                        'fPrice': product.fPrice,
                        'fShipping': product.fShipping,
                        'nInventory': product.nInventory,
                        'vchImagePath': product.vchImagePath,
                        'bIsDeleted': product.bIsDeleted,
                    } for product in products] if products else []
                except Exception as e:
                    response['products'] = []

                try:
                    # get orders for store associaed with this user
                    orders = ordersTable.query.filter_by(nUserID=u.aID).all()
                    response['orders'] = [{
                        'aID': order.aID,
                        'nStoreID': order.nStoreID,
                        'nUserID': order.nUserID,
                        'nItemID': order.nItemID,
                        'nItemCount': order.nItemCount,
                        'fCostTotal': order.fCostTotal,
                        'fShippingTotal': order.fShippingTotal,
                        'fGrandTotal': order.fGrandTotal,
                        'bIsPaid': order.bIsPaid,
                        'nCCInfoID': order.nCCInfoID,
                        'nShippingAddressID': order.nShippingAddressID,
                        'nBillingAddressID': order.nBillingAddressID,
                        'bIsShipped': order.bIsShipped,
                        'bIsCanceled': order.bIsCanceled,
                        'dtInsertDate': order.dtInsertDate,
                        'dtUpdateDate': order.dtUpdateDate
                    } for order in orders] if orders else []
                except Exception as e:
                    response['orders'] = []

                try:
                    # get any tracks associated with the user
                    tracks = tracksTable.query.filter_by(nAuthorID=u.aID).all()
                    #tracks = tracksTable.query.all()
                    response['tracks'] = [{
                        'aID': track.aID,
                        'nAuthorID': track.nAuthorID,
                        'vchTitle': track.vchTitle,
                        'txtDescription': track.txtDescription,
                        'vchAudioURL': track.vchAudioURL,
                        'vchImagePath': track.vchImagePath,
                        'nGenreID': track.nGenreID,
                    } for track in tracks] if tracks else []
                     #get artust name for each track
                    #for track in response['tracks']:
                        #artist = usersTable.query.filter_by(aID=track['nAuthorID']).first()
                        #track['vchAuthorName'] = f'{artist.vchFirstName} {artist.vchLastName}'
                except Exception as e:
                    response['tracks'] = []

                try:
                    # get any tracks in which user was the artist
                    music = musicTable.query.filter_by(nArtistID=u.aID).all()
                    response['music'] = [{
                        'aID': track.aID,
                        'nUserID': track.nUserID,
                        'nArtistID': track.nArtistID,
                        'vchTrackName': track.vchTrackName,
                        'txtTrackDescription': track.txtTrackDescription,
                        'vchTrackPath': track.vchTrackPath,
                        'nGenreID': track.nGenreID,
                        'nStoreID': track.nStoreID
                    } for track in music] if music else []
                except Exception as e:
                    response['music'] = []


                try:
                    # get any followers associated with the user
                    followers = followersTable.query.filter_by(nUserID=u.aID).all()
                    response['followers'] = [{
                        'aID': follower.aID,
                        'nUserID': follower.nUserID,
                        'nFollowerID': follower.nFollowerID
                    } for follower in followers] if followers else []
                except Exception as e:
                    response['followers'] = []

                try:
                    # get any users being followed by the user
                    following = followersTable.query.filter_by(nFollowerID=u.aID).all()
                    response['following'] = [{
                        'aID': follow.aID,
                        'nUserID': follow.nUserID,
                        'nFollowerID': follow.nFollowerID
                    } for follow in following] if following else []
                except Exception as e:
                    response['following'] = []

                try:
                    # get any orders associated with the user
                    orders = ordersTable.query.filter_by(nUserID=u.aID).all()
                    response['orders'] = [{
                        'aID': order.aID,
                        'nUserID': order.nUserID,
                        'nItemCount': order.nItemCount,
                        'fCostTotal': order.fCostTotal,
                        'fShippingTotal': order.fShippingTotal,
                        'fGrandTotal': order.fGrandTotal,
                        'bIsPaid': order.bIsPaid,
                        'nCCInfoID': order.nCCInfoID,
                        'nShippingAddressID': order.nShippingAddressID,
                        'nBillingAddressID': order.nBillingAddressID,
                        'bIsShipped': order.bIsShipped,
                        'bIsCanceled': order.bIsCanceled,
                        'dtInsertDate': order.dtInsertDate,
                        'dtUpdateDate': order.dtUpdateDate
                    } for order in orders] if orders else []

                    # get any order items associated with the orders and add them to the response entries
                    for order in response['orders']:
                        items = orderItemsTable.query.filter_by(nOrderID=order.aID).all()
                        order.items = [{
                            'aID': item.aID,
                            'nOrderID': item.nOrderID,
                            'nProductID': item.nProductID,
                            'nQuantity': item.nQuantity,
                            'fPrice': item.fPrice
                        } for item in items] if items else []
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
    data = request.get_json()
    try:
        users = Users()
        try:
            u = users.query.filter_by(vchUsername=data['username']).first()
        except Exception as e:
            return make_response(jsonify({'message': 'signup unsuccessful3', 'error':str(e)}), 500)
        if u:
            return make_response(jsonify({'message': 'username already exists'}), 409)
        else:
            u = Users(
                vchFirstName=data['firstName'],
                vchLastName=data['lastName'],
                vchUsername=data['username'],
                vchPassword=data['password'],
                vchEmail=data['email']
            )
            db.session.add(u)
            db.session.commit()
            return jsonify({
                'aID': u.aID,
                'vchUsername': u.vchUsername,
                'vchEmail': u.vchEmail,
                'vchPassword': u.vchPassword,
                'vchFirstName': u.vchFirstName,
                'vchLastName': u.vchLastName,
                'bIsVerified': u.bIsVerified,
                'txtBio': u.txtBio,
                'vchProfilePicPath': u.vchProfilePicPath,
                'bIsBanned': u.bIsBanned
            }), 201
    except Exception as e:
        return make_response(jsonify({'message': 'signup unsuccessful2', 'error':str(e), 'data':data}), 500)

# create store
@app.route('/create-store', methods=['POST'])
def create_store():
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
        return make_response(jsonify({
            'aID': s.aID,
            'nUserID': s.nUserID,
            'vchName': s.vchName,
            'txtDescription': s.txtDescription
        }), 201)
    except Exception as e:
        return make_response(jsonify({'message': 'store not created', 'error':str(e), 'data':data}), 500)

# add product
@app.route('/add-product', methods=['POST'])
def add_product():
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
        response['products'] = [{
            'aID': product.aID,
            'nStoreID': product.nStoreID,
            'vchName': product.vchName,
            'txtDescription': product.txtDescription,
            'fPrice': product.fPrice,
            'fShipping': product.fShipping,
            'nInventory': product.nInventory,
            'vchImagePath': product.vchImagePath,
            'bIsDeleted': product.bIsDeleted,
        } for product in products] if products else []
        return make_response(jsonify(response), 201)
    except Exception as e:
        return make_response(jsonify({'message': 'product not added', 'error':str(e), 'response':response}), 500)

# delete product
@app.route('/delete-product', methods=['POST'])
def delete_product():
    response = {}
    try:
        data = request.get_json()
        storeID = data['nStoreID']
        p = Products.query.filter_by(aID=data['aID']).first()
        if p:
            db.session.delete(p)
            db.session.commit()
            productsTable = Products()
            products = productsTable.query.filter_by(nStoreID=storeID).all()
            response['products'] = [{
                'aID': product.aID,
                'nStoreID': product.nStoreID,
                'vchName': product.vchName,
                'txtDescription': product.txtDescription,
                'fPrice': product.fPrice,
                'fShipping': product.fShipping,
                'nInventory': product.nInventory,
                'vchImagePath': product.vchImagePath,
                'bIsDeleted': product.bIsDeleted,
            } for product in products] if products else []
            return make_response(jsonify(response), 200)
        return make_response(jsonify({'message': 'product not found'}), 404)
    except Exception as e:
        return make_response(jsonify({'message': 'product not deleted', 'error':str(e), 'response':response}), 500)

# update store
@app.route('/update-store', methods=['POST'])
def update_store():
    data = request.get_json()
    try:
        s = Stores.query.filter_by(aID=data['aID']).first()
        if s:
            s.nUserID = data['nUserID']
            s.vchName = data['vchName']
            s.txtDescription = data['txtDescription']
            # update the database with new values
            db.session.commit()
            return make_response(jsonify({
                'aID': s.aID,
                'nUserID': s.nUserID,
                'vchName': s.vchName,
                'txtDescription': s.txtDescription
            }), 200)
        return make_response(jsonify({'message': 'store not found'}), 404)
    except Exception as e:
        return make_response(jsonify({'message': 'store not updated', 'error':str(e),'data':data}), 500)

# add track
@app.route('/add-track', methods=['POST'])
def add_track():
    response = {}
    try:
        data = request.get_json()
        authorID = data['nAuthorID']
        t = Tracks(
            nAuthorID=data['nAuthorID'],
            vchTitle=data['vchTitle'],
            txtDescription=data['txtDescription'],
            vchAudioURL=data['vchAudioURL'],
            vchImagePath=data['vchImagePath'],
            nGenreID=data['nGenreID'],
            dtUpdateDate=data['dtUpdateDate'],
            dtInsertDate=data['dtInsertDate']
        )
        db.session.add(t)
        db.session.commit()
        tracksTable = Tracks()
        tracks = tracksTable.query.filter_by(nAuthorID=authorID).all()
        response['tracks'] = [{
            'aID': track.aID,
            'nAuthorID': track.nAuthorID,
            'vchTitle': track.vchTitle,
            'txtDescription': track.txtDescription,
            'vchAudioURL': track.vchAudioURL,
            'vchImagePath': track.vchImagePath,
            'nGenreID': track.nGenreID,
            'dtUpdateDate': track.dtUpdateDate,
            'dtInsertDate': track.dtInsertDate,
        } for track in tracks] if tracks else []
        return make_response(jsonify(response), 201)
    except Exception as e:
        return make_response(jsonify({'message': 'track not added', 'error':str(e), 'response':response}), 500)

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


#get all stores
@app.route('/store/all', methods=['GET'])
def get_stores():
    try:
        stores = Stores.query.all()
        stores_data = [{'id': store.aID, 'name': store.vchName, 'user': store.nUserID, 'txtDescription':store.txtDescription} for store in stores]
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
    

#get tracks for user
@app.route('/tracks/<int:user_id>', methods=['GET'])
def get_tracks_by_user(user_id):
    try:
        # Query track by store ID
        tracks = Tracks.query.filter_by(nAuthorID=user_id).all()
        
        # Convert tracks to JSON format
        tracks_data = [{
            'id': track.aID,
            'name': track.vchTitle,
            'description': track.txtDescription,
        } for track in tracks]
        
        return jsonify(tracks_data), 200
    except Exception as e:
        return make_response(jsonify({'message': 'error getting products', 'error': str(e)}), 500)

#listen to track/music by id
@app.route('/track/<int:track_id>', methods=['GET'])
def listen_to_music(track_id):
    try:
        track = Tracks.query.get(track_id)
        if track:
            #new for share link
            track_data = track.to_json()
            full_url = request.host_url + 'track/' + str(track_id)
            track_data['share_url'] = full_url
            #
            return jsonify({'message': 'Listening to track', 'track': track.to_json()}), 200
        else:
            return jsonify({'message': 'Track not found'}), 404
    except Exception as e:
        return jsonify({'message': 'Error listening to music', 'error': str(e)}), 500
    
def allowed_file(filename):
    return '.' in filename and \
        filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/url_route', methods=['POST'])
def upload_file():
    d = {}
    try:
        
        file = request.files['file_from_react']
        if file.filename == '':
            print(f"No selected file")
            d['status'] = 2
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            print(f"Uploading file {filename}")
            file.save(app.config['UPLOAD_FOLDER'] + filename)
            d['status'] = 1      

    except Exception as e:
        print(f"Couldn't upload file {e}")
        d['status'] = 0
    
    return jsonify(d)


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
                        'ownerName': ownerName.vchUsername
                    }
                    return make_response(jsonify(store_data), 200)
                return make_response(jsonify({'message' : 'owner not found'}), 404)
        return make_response(jsonify({'message': 'store not found'}), 404)
    except Exception as e:
        return make_response(jsonify({'message': 'error getting store', 'error':str(e)}), 500)
    
    
#get user by id
@app.route('/user/<int:user_id>', methods=['GET'])
def get_user_by_id(user_id):
    try:
        #try to get the user by its id
        user = Users.query.filter_by(aID=user_id).first()
        if user:
            user_data ={
                'id': user.aID,
                'username': user.vchUsername,
                'bio': user.txtBio,
                'email': user.vchEmail,
            }
            return make_response(jsonify(user_data), 200)
        return make_response(jsonify({'message': 'user not found'}), 404)
    except Exception as e:
        return make_response(jsonify({'message': 'error getting user', 'error':str(e)}), 500)

    


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


#search for track/music
@app.route('/track', methods=['GET'])
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

#heart a song: currently missing heart model
@app.route('/tracks/heart/<int:track_id>', methods=['POST'])
def toggle_heart(track_id):
    data = request.get_json()
    user_id = data.get('user_id')
    try:
        heart = Heart.query.filter_by(track_id = track_id, user_id = user_id).first()

        if heart:
            db.session.delete(heart)
            db.session.commit()
            hearted = False
        else:
            new_heart = Heart(track_id = track_id, user_id = user_id)
            db.session.add(new_heart)
            db.session.commit()
            hearted = True

        return jsonify({'hearted': hearted}), 200
    except Exception as e:
        return jsonify({'message': 'Error toggling heart', 'error': str(e)}), 500
    
#report user/product: -needs a reports database
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

#
@app.route('/products/<int:store_id>', methods=['GET'])
def get_products_by_store(store_id):
    try:
        # Query products by store ID
        products = Products.query.filter_by(nStoreID=store_id).all()
        
        # Convert products to JSON format
        products_data = [{
            'aID' : product.aID,
            'vchName' : product.vchName,
            'txtDescription' : product.txtDescription,
            'fPrice' : product.fPrice,
            'fShipping': product.fShipping,
            'nInventory': product.nInventory
        } for product in products]
        
        return jsonify(products_data), 200
    except Exception as e:
        return make_response(jsonify({'message': 'error getting products', 'error': str(e)}), 500)

# get all tracks
@app.route('/tracks/all', methods=['GET'])
def get_tracks():
    try:
        tracks = Tracks.query.all()
        tracks_data = [{'id': track.aID, 'author': track.nAuthorID, 'title':track.vchTitle, 'description':track.txtDescription, 'audio':track.vchAudioURL, 'genre':track.nGenreID } for track in tracks]
        return jsonify(tracks_data), 200
    except Exception as e:
        return make_response(jsonify({'message': 'error getting users', 'error':str(e)}), 500)

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

#add to cart
@app.route('/cart/add', methods=['POST'])
def add_cart():
    response = {}
    try:
         data = request.get_json()
         ban = Cart(
             nUserID= data['nUserID'],
             nProductID= data['nProductID'],
             nStoreID= data['nStoreID'],
             nQuantity= data['nQuantity']
         )
         db.session.add(ban)
         db.session.commit()

         response['cart'] = {
             'aID': ban.aID,
             'nUserID': ban.nUserID,
             'nProductID': ban.nProductID,
             'nStoreID': ban.nStoreID,
             'nQuantity': ban.nQuantity
         }

         return make_response(jsonify(response), 201)
    except Exception as e:
         return make_response(jsonify({'message': 'Ban not added', 'error': str(e), 'response': response}), 500)

#get cart all by user id
@app.route('/cart/<int:user_id>', methods=['GET'])
def get_cart_by_user(user_id):
     try:
         # Query cart items by user ID
         cart_items = Cart.query.filter_by(nUserID=user_id).all()

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
@app.route('/delete-cart', methods=['POST'])
def delete_cart():
     response = {}
     try:
         data = request.get_json()
        # ban_id = data['aID']
         ban = Cart.query.filter_by(aID=data['aID']).first()
         if ban:
             db.session.delete(ban)
             db.session.commit()
             return make_response(jsonify({'message': 'Item deleted successfully'}), 200)
         return make_response(jsonify({'message': 'Item not found'}), 404)
     except Exception as e:
         return make_response(jsonify({'message': 'Item not deleted', 'error': str(e)}), 500)
     



### ------------- TESTING ------------- ###

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


### ------------- RUN FLASK SERVER ------------- ###
if __name__ == '__main__':
    app.run(debug=False, port=5000)