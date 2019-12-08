from flask_restful import Resource, reqparse
import uuid
from bson.json_util import dumps
from bson.objectid import ObjectId
import datetime
## Instance is used to track the scoring information
## The actual score for each teams instance is stored here
## Instance atached to round and also attached to teams
## This needs to be secured...somehow...but fuck that shit
## Collection structure
'''
{
    "_id":ObjectID,
    "uid":uuid,
    "os_details":{
        "hostname":String,
        "release":String,
        "ip":String,
    },
    "scoringConf":{
        <WIP>
    },
    "team":{
        "_id":ObjectID,
        "team_name":String,
    },
    "score":{
        "current":Int,
        "previous":Int
    },
    "created_at":Datetime,
    "last_updated":Datetime,
    "running":bool
}
'''
class Instance(Resource):

    def __init__(self,**kwargs):
        self.db = kwargs['mongo']
        self.Instance_col = self.db.Instances

    ## Get the instance information 
    ## /api/instance&round=<round name>
    ## /api/instance&team=<team name>
    def get(self):
        return {"messge": "Instance Information"}

    ## /api/instance
    '''
    {
        "os_details":{
            "hostname":String,
            "release":String,
            "ip":String,
        },
        "scoringConf":{
            ## Maybe this will be stored somewhere else...like a database...crazy
            <WIP>
        },
        "team":{
            "team_name":String,
        }
    }
    '''

    def _get_oid(self, src_col, fil):
        col = self.db[src_col]
        doc = col.find_one(fil)

        ## gonna have to do this some more, make it look pretty
        if doc:
            return doc['_id']
        else:
            raise Exception("Team name not found")

    def post(self):
        root_parser = reqparse.RequestParser()
        root_parser.add_argument("os_details", location='json', type=dict)
        root_parser.add_argument("scoring_config",location='json', type=dict)
        root_parser.add_argument("team", location='json', type=dict)
        args = root_parser.parse_args()

        return_list = []
    
        ## this doesnt check if the argument is not theres
        ## might need to look into that..or not...who needs verbosity
        for arg in args:
            if args[arg] == None:
                return_list.append(arg)
        
        if len(return_list) > 0:
            return {"Message":"Missing or invalid arguments", "arguments":return_list}
        else:
            new_instance = args

        ## Lookup team_name in Teams and extract the oid
        ## I do like how this is being done with exception
        try:
            new_instance['team']['_id'] = self._get_oid("Teams", {"team_name":args['team']['team_name'].lower()})
        except Exception as err:
            ## These responses need to actuall change the status codes
            return {"message":str(err)}

        ## Attach other values
        new_instance['score'] = {
            "current":0,
            "previous":0
        }
        new_instance['uid'] = str(uuid.uuid4())
        new_instance['created_at'] = datetime.datetime.now()
        new_instance['last_updated'] = None
        new_instance['running'] = None

        self.Instance_col.insert_one(new_instance)

        return {"message":"Creating new instance", "instance":dumps(new_instance)}
        #print(args)
