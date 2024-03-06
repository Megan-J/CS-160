# CS-160

### Server (backend)

- to activate the virtual environment for backend, use the command

```bash
cd server
source venv/bin/activate
```

- install flask and dependencies:

```bash
cd server
pip3 install flask
pip3 install -U flask-cors
pip3 install -U Flask-SQLAlchemy

```

- to run the server:

```bash
cd server
python3 server.py
```

- to stop the server:

```bash
cd server
^C
```

### Client (frontend)

- to run the client server

```bash
cd client
npm run dev
```
