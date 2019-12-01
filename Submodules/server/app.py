

from flask import Blueprint
from flask_restful import Api
from .api.team import Team

api_bp = Blueprint('api', __name__)
api = Api(api_bp)


## need to loop through all the files in /api and add them as a resource
api.add_resource(Team, '/team')
