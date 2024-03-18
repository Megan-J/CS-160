from flask import request, jsonify, make_response
from models import app, db, Users, Storefronts

#test route; must navigate to this url after activating 8080
@app.route('/home', methods=['GET'])
def get_contacts():
    data = {"message": "subscribe"}
    return jsonify(data)

#create store
@app.route('/flask/createStores', methods=['POST'])
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
@app.route('/flask/getStores', methods=['GET'])
def get_stores():
    try:
        stores = Storefronts.query.all()
        stores_data = [{'id': store.aID, 'name': store.vchStoreName, 'user': store.nUserID, 'txtDescription':store.txtDescription} for store in stores]
        return jsonify(stores_data), 200
    except Exception as e:
        return make_response(jsonify({'message': 'error getting users', 'error':str(e)}), 500)

#get all users
@app.route('/flask/getUsers', methods=['GET'])
def get_users():
    try:
        users = Users.query.all()
        users_data = [{'id': user.aID, 'username': user.vchUsername, 'email': user.vchEmail} for user in users]
        return jsonify(users_data), 200
    except Exception as e:
        return make_response(jsonify({'message': 'error getting users', 'error':str(e)}), 500)

#create user
@app.route('/flask/createUser', methods=['POST'])
def create_user():
    try:
        data = request.get_json()
        new_user = Users(
            vchFirstName=data['vchFirstName'],
            vchLastName=data['vchLastName'],
            vchPassword=data['vchPassword'],
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
app.route('flask/users/<id>', methods=['GET'])
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
    app.run(debug=False, port=8080)