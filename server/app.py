'''
    app.py

    REST endpoints for the CloudSound application:

    - /user/<int:user_id>
    - /user/create
    - /users/all
    - /user/follow

    - /store/create
    - /store/update
    - /store/all

    - /products/<int:store_id>
    - /product/add
    - /product/delete
    - /product/update
    - /product/image/link

    - /track?query=<string:query>
    - /track/<int:track_id>

    - /file/<path:filename>
    - /track/upload
    - /track/upload/link
    - /image/upload
    - /product/image/upload

    - /login
    - /signup
    - /verify/<token>
    - /get-user/<int:id>

    - /search
'''

if "-----[ imports ]-----":
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
    # from models import app, db, Addresses, CCInfo, CCTypes, Countries, Followers, OrderItems, Orders, Products, States, StoreFollowers, Storefronts, Tracks, Users
    from werkzeug.security import generate_password_hash, check_password_hash
    from werkzeug.utils import secure_filename
    import sys
    from os.path import exists
    import os
    import traceback

if "-----[ app setup ]-----":
    app = Flask(__name__)
    CORS(app) 
    app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqlconnector://root@localhost/cloudsound'
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

    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'bmp', 'mp4', 'mov', 'mp3', 'wav', 'm4a', 'flac'}

    app.config['SECRET_KEY'] = 'beneaththeradar'
    app.config['SECURITY_PASSWORD_SALT'] = b'77'

    mail = Mail(app)

if "-----[ db setup ]-----":
    db = SQLAlchemy(app)

    meta = db.MetaData()

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

    class Genres(db.Model):
        __table__ = db.metadata.tables['Genres']

    class OrderItems(db.Model):
        __table__ = db.metadata.tables['OrderItems']

    class Orders(db.Model):
        __table__ = db.metadata.tables['Orders']

    class PlaylistSongs(db.Model):
        __table__ = db.metadata.tables['PlaylistSongs']

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
        # followers = db.relationship('Followers', backref='users', lazy=True)

    tables = {
        'Addresses': Addresses(),
        'CCInfo': CCInfo(),
        'CCTypes': CCTypes(),
        'Countries': Countries(),
        'Followers': Followers(),
        'Genres': Genres(),
        'OrderItems': OrderItems(),
        'Orders': Orders(),
        'PlaylistSongs': PlaylistSongs(),
        'Products': Products(),
        'States': States(),
        'StoreFollowers': StoreFollowers(),
        'Stores': Stores(),
        'Tracks': Tracks(),
        'Users': Users(),
    }

if "-----[ helper functions ]-----":
    def allfields(name, item):
        return {col: getattr(item, col) for col in tables[name].__table__.columns.keys()}

    def allowed_file(filename):
        return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

if "-----[ testing endpoints ]-----":
    @app.route('/check', methods=['GET'])
    def do_check():
        try:
            items = Tracks().query.all()
            return make_response(jsonify({'message': 'check', 'meta':[allfields('Tracks', item) for item in items]}),200)
        except Exception as e:
            return make_response(jsonify({'message': 'error checking', 'error':str(e)}), 500)

if "-----[ user endpoints ]-----":
    #get all users
    @app.route('/users/all', methods=['GET'])
    def do_user_all():
        try:
            users = Users.query.all()
            users_data = [allfields('Users', user) for user in users] if users else []
            return make_response(jsonify(users_data), 200)
        except Exception as e:
            return make_response(jsonify({'message': 'error getting users', 'error':str(e)}), 500)

    #create user
    @app.route('/user/create', methods=['POST'])
    def do_user_create():
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

if "-----[ store endpoints ]-----":
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

    #get all stores
    @app.route('/store/all', methods=['GET'])
    def do_store_all():
        try:
            stores = Stores().query.all()
            stores_data = [allfields('Stores', store) for store in stores]
            return make_response(jsonify(stores_data), 200)
        except Exception as e:
            return make_response(jsonify({'message': 'error getting users', 'error':str(e)}), 500)

if "-----[ product endpoints ]-----":
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

if "-----[ track endpoints ]-----":
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
                    filename = f'{filename}_{datetime.now().strftime("%Y%m%d%H%M%S")}{file_extension}'
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

    #add song to playlist
    @app.route('/playlistsongs/add', methods=['POST'])
    def do_playlistsongs_upload(): 
        response = {}
        try:
            data = request.get_json()
            storeID = data['nUserID']
            track = data['vchTrackName']
            #find track id from track name
            trackID = Tracks.query.get(track)
            if not trackID:
                return make_response(jsonify({'message': 'Track not found'}), 404)

            p =  PlaylistSongs(
                nUserID=data['nUserID'],
                nTrackID=trackID.aID
            )
            db.session.add(p)
            db.session.commit()
            response['playlistsong'] = {
             'aID': p.aID,
             'nUserID': p.nUserID,
             'nTrackID': p.nTrackID,
            }
            return make_response(jsonify(response), 201)
        except Exception as e:
            return make_response(jsonify({'message': 'product not added', 'error':str(e), 'response':response}), 500)

    #get playlistsongs by user
    @app.route('/playlistsongs/<int:user_id>', methods=['GET'])
    def get_playlistsongs_by_user(user_id):
        try:
            # Query playlist songs by user ID
            cart_items = PlaylistSongs.query.filter_by(nUserID=user_id).all()

            # Initialize an empty list to store formatted cart items
            formatted_cart_items = []

            # Iterate over each song in playlist
            for cart_item in cart_items:
                # Get the id associated with the song 
                track = Tracks.query.get(cart_item.nTrackID)
                if track:
                    # Get the store associated with the product
                    user = Users.query.get(track.nUserID)
                    if user:
                        # Create a dictionary representing the formatted cart item
                        formatted_cart_item = {
                         'playlist_id': cart_item.aID,
                         'user_id': cart_item.nUserID,
                         'track_id': cart_item.nTrackID,
                         'track_title': track.vchTitle,  # Include product name
                         'vchAudioURL':track.vchAudioURL,
                         'vchArtistFirst': user.vchFirstName,
                         'vchArtistLast': user.vchLastName,
                        }
                        # Append the formatted cart item to the list
                        formatted_cart_items.append(formatted_cart_item)

            # Return the formatted cart items as JSON response
            return jsonify(formatted_cart_items), 200
        except Exception as e:
            return make_response(jsonify({'message': 'Error getting songs in playlist', 'error': str(e)}), 500)

    # delete song from playlist
    @app.route('/playlistsongs/delete', methods=['POST'])
    def do_playlistsongs_delete():
        response = {}
        try:
            data = request.get_json()
            id = data['aID']
            p = PlaylistSongs().query.filter_by(aID=id).first()
            if p:
                db.session.delete(p)
                db.session.commit()
                return make_response(jsonify(response), 200)
            return make_response(jsonify({'message': 'playlistsong not found'}), 404)
        except Exception as e:
            return make_response(jsonify({'message': 'playlistsong not deleted', 'error':str(e), 'response':response}), 500)

if "-----[ image endpoints ]-----":
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
                    filename = f'{filename}_{datetime.now().strftime("%Y%m%d%H%M%S")}{file_extension}'
                    file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
                else:
                    filename = secure_filename(file.filename)
                    file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        return make_response(jsonify({'filename':filename}), 200)

if "-----[ file endpoints ]-----":
    @app.route('/file/<path:filename>', methods=['GET'])
    def do_file_get(filename):
        filepath = f'uploads/{filename}'
        #return make_response(jsonify({'message': filepath}), 200)
        #return make_response('foo',200)
        if exists(filepath):
            return send_from_directory('uploads', filename, as_attachment=False)
        else:
            return make_response(jsonify({'message': 'File not found'}), 404)

if "-----[ login/signup endpoints ]-----":
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
            playlistsongsTable = PlaylistSongs()

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
                        # get any playlist songs of user
                        playlistsongs = playlistsongsTable.query.filter_by(nUserID=user_id).all()
                        response['playlistsongs'] = [allfields('Playlistsongs', playlistsong) for playlistsong in playlistsongs] if playlistsongs else []
                    except Exception as e:
                        response['playlistsongs'] = []
                    
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

if "-----[ login/signup endpoints ]-----":
    # get user by id
    @app.route('/get-user/<id>', methods=['GET'])
    def do_get_user(id):
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
            playlistsongsTable = PlaylistSongs()

            try:
                u = usersTable.query.filter_by(aID=id).first()
                response = {}
                response["user"] = allfields('Users', u)
                user_id = id
                try:
                    # get genres
                    genres = genresTable.query.all()
                    response['genres'] = [allfields('Genres', genre) for genre in genres] if genres else []
                except Exception as e:
                    response['genres'] = []

                try:
                    # get any playlist songs of user
                    playlistsongs = playlistsongsTable.query.filter_by(nUserID=user_id).all()
                    response['playlistsongs'] = [allfields('Playlistsongs', playlistsong) for playlistsong in playlistsongs] if playlistsongs else []
                except Exception as e:
                        response['playlistsongs'] = []

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
                    # get any users being followed by the logged in user
                    recs = Followers().query.filter_by(nUserID=user_id).all()
                    following_ids = [follow.nFollowingID for follow in recs]
                    users = Users().query.filter(Users.aID.in_(following_ids)).all()
                    response['following'] = [allfields('Users', user) for user in users]
                except Exception as e:
                    response['following'] = []

                try:
                    # get any users following the logged in user
                    recs = Followers().query.filter(nFollowingID=user_id).all()
                    followers_ids = [follow.nUserID for follow in recs]
                    users = Users().query.filter(Users.aID.in_(followers_ids)).all()
                    response['followers'] = [allfields('Users', user) for user in users]
                except Exception as e:
                    response['followers'] = []

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
                return make_response(jsonify({'message': 'retrieve user failed', 'error':str(e)}), 500)
        except Exception as e:
            return make_response(jsonify({'message': 'retrieve user failed', 'error':str(e)}), 500)

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

if "-----[ verify email endpoint ]-----":
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

if "-----[ search endpoint ]-----":
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
        



if __name__ == '__main__':
    # with app.app_context():
    #     db.create_all()
    app.run(debug=False, port=5000)
    