from flask_restful import Resource


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
    def get(self):
        return {"message": "Hello, World!"}

    def post(self):
        return {"messsage":"Creating new team"}