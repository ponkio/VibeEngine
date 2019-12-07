from flask_restful import Resource, reqparse
import uuid
from bson.json_util import dumps

'''
Get team information
req:
    GET api/team/uid
resp:
    {'team':{
        'name':<team name>,
        'clients':<client id>
        'rounds':<rounds the team has competed in>,
        'uid':<uuid>
    }}

Create a new team
req:
    POST api/team
    data:
        {
            'name':<team name>
        }
resp:
    {'team':{
        'name':<team name>,
        'uid':<uuid>
    }}

Add client to new team
req:
    PUT api/team/client/<uid>
    data:
    {
        'client':<client id>
    }

resp:
    {'team':{
        'name':<team name>,
        'members':<team memebers>
    }}

Add team to round
'''
class Team(Resource):

    def __init__(self,**kwargs):
        self.db = kwargs['mongo']
        self.Teams_col = self.db.Teams

    def _redact_info(self, teams):
        return_list = []
        for team in teams:
            delete = [key for key in team if key in ["uid", "_id"]] 
            for key in delete: del team[key] 
            return_list.append(team)
        return return_list

    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument("team_name", location='args')
        parser.add_argument("team_number", location='args')
        args = parser.parse_args()

        ## This will pull all the ones that are equal to None also...fuck I need a drink
        ## This also should be done with a map()
        teams = self._redact_info(list(self.Teams_col.find({"$or":[{"team_name":args['team_name'].lower()}, {"team_number":args['team_number']}]})))
        
        return {"message":"Teams found","Teams":dumps(teams)}

    def _generate_team(self, team):
        team['team_name'] = team['team_name'].lower()
        team['uid'] = str(uuid.uuid4())
        team['rounds'] = None
        ## instances will be changed each round
        ## Maybe I can have a history of the instances...probably not thats dumb
        team['instances'] = None

        return team

    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument("team_name", location='json')
        parser.add_argument("team_number", location='json')
        args = parser.parse_args()

        return_list = []
    
        ## this doesnt check if the argument is not theres
        ## might need to look into that..or not...who needs verbosity
        for arg in args:
            if args[arg] == None:
                return_list.append(arg)
        
        if len(return_list) > 0:
            return {"Message":"Missing or invalid arguments", "arguments":return_list}

        ## This is a dumb way to do this but all I can think of right now
        if self.Teams_col.find_one({"$or":[{"team_name":args['team_name'].lower()}, {"team_number":args['team_number']}]}):
            return {"Message":"Team name or number taken"}

        else:

            new_team = self._generate_team(args)
            self.Teams_col.insert_one(new_team)

            return {"Message":"Generating new team","Team":dumps(new_team)}

    '''
    def delete(self):
        Delete team if the UID matches
    '''