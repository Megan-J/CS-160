from flask import request, jsonify
from models import app
#, db

#test route; must navigate to this url after activating 8080
@app.route('/home', methods=['GET'])
def get_contacts():
    data = {"message": "subscribe"}
    #User.query.all()
    #json_contacts = list(map(lambda x: x.to_json(), contacts))
    return jsonify(data)



#port should be 8080
if __name__ == '__main__':
    #with app.app_context():
        #db.create_all()
    app.run(debug=False, port=8080)