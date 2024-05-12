# Radar

## Description

Radar offers users with unique shopping experiences curated by their favorite music artists.

## Installation:

To install and set up the Radar application on your own machine, follow the steps below:

### Prerequistics

- **Node.js**: Check if Node.js is installed. If not, download and install Node.js from [their website](https://nodejs.org/)
- **MySQL Workbench**: Check if you have MySQL Workbench is downloaded. If not, download and install from [their website](https://www.mysql.com/products/workbench/). Open the application, create a user with the connection of 3306, run the dump file located the database folder.

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

install dependencies

```bash
npm install
```

run the client server

```bash
npm run dev
```
