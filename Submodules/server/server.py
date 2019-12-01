## Goals for the server
## - Have the ability to run more than one round at once
## - Clients will have teams
## - MongoDB will manage:
##  - What rounds are running and what clients are running on that round
##  - Registered clients with teams 
##  - Current score for clients
## Might have to install dependencies like mongo on the system...oops
### Folder structure
# app.py - Loads all the api routes to the app
# api/* - routes for the API
# config.py - Config for the api server
###
from flask import Flask

class Server:
    def __init__(self, listeningAddr='0.0.0.0', listeningPort=46415):
        self.listeningAddr = listeningAddr
        self.listeningPort = listeningPort

    def start_api(self):
        app = Flask(__name__)
        #app.config.from_object(config_filename)
        
        from .app import api_bp
        app.register_blueprint(api_bp, url_prefix='/api')

        return app

    def start(self):
        vEngineAPI = self.start_api()
        vEngineAPI.run(self.listeningAddr,self.listeningPort,debug=False)  