# CS-160

#### Notes:
- all commands written below are for mac
- install node.js if it isn't on your computer yet

### Server (backend)

first, go into the server directory
```bash
cd server
```

to activate the virtual environment for backend, use the command

```bash
source venv/bin/activate
```

install flask and dependencies (should be in the virtual environment when doing this):

```bash
pip3 install flask
pip3 install -U flask-cors
pip3 install -U Flask-SQLAlchemy
pip3 install -U mysql-connector-python

```

to run the server:

```bash
python3 app.py
```

to stop the server:

```bash
^C
```

to deactivate environment:
```bash
deactivate
```

### Client (frontend)

you must be in the client directory when executing these commands
```bash
cd client
```

to run the client server

```bash
npm run dev
```

if dependencies not installed yet
```bash
npm install
```
