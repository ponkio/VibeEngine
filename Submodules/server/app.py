

from flask import Blueprint
from flask_restful import Api
from pymongo import MongoClient
from .api.team import Team
from .api.instance import Instance
from .api.round import Round

## What a python way to do things
mongo = MongoClient('mongodb://localhost:27017/').VibeEngine

## wtf is a bluepring
api_bp = Blueprint('api', __name__)
api = Api(api_bp)


## need to loop through all the files in /api and add them as a resource
## or I could just like structure this correctly...
## This is fucking stupid way to do this but...oh well I guess
api.add_resource(Team, '/team', resource_class_kwargs={'mongo':mongo})
api.add_resource(Instance, '/instance', resource_class_kwargs={'mongo':mongo})
api.add_resource(Round, '/round', resource_class_kwargs={'mongo':mongo})
