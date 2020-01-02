# VibeEngine Server
## Description
The VibeEngine server is what is used to manage scoring of the clients. Clients connect to the server and the server will put clients into a round or score them individually.  

The server is designed in such a way that the client and the server can be run parallel on the same system OR the server can on a separate system. These settings are configured with the `VibeEngine` cli. 

## Workflow
- Client registers with server (*see REST API section*)
    - Client will report the engine configuration and team configuration
    - In the team configuration there will be a round option. If the round is not already running on the server then a new round will be created
- Once the client is registered and a round is started the server will periodically send `GET` requests to the clients to get an update of the score
- Clients response with the score will get updated in the MongoDB  
- Round scores will get displayed with data from the MongoDB or accessed directly via the REST API.

## REST API  
There are 3 endpoint for the rest API which are all used to interface with the backend MongoDB database. 



### Round
___
Rounds are used as mock competitions. These will attempt to simulate a real world CyberPatriot competition. A round will only keep track of instances within the round insteam of teams. This allows a single team to compete in multiple rounds at the same time without confusion on the backend. 
  
**Schema**
```
{
    name: {type:String, required:[true, 'Round name required']},
    uid: String,
    running:{type:Boolean,default:false},
    instances: [
        {type:mongoose.Schema.Types.ObjectId, ref:'Instances'}
    ],
    config: {
        round_time_limit: {type:Number,min:1, max:9999, default:1444},
        instance_time_limit: {type:Number, min:1, max:9999, default:360},
        instance_limit: {type:Number, min:1, max:5, default:1}
    }
}
```  
`GET /api/rounds?key=value`  

_Adding `verbose=true` to the url will resolve the team ObjectID to the respective document._ 

Resp:
```
{
    "status": 200,
    "round": {
        "config": {
            "round_time_limit": 50,
            "instance_time_limit": 90,
            "instance_limit": 1
        },
        "running": false,
        "instances": [],
        "_id": "5e0bed41a33da001babc2e48",
        "name": "Not Oklahoma Cup",
        "uid": "ead57458-8377-452d-9d0f-ca2a8d511237",
        "createdAt": "2020-01-01T00:52:17.819Z",
        "updatedAt": "2020-01-01T00:52:17.819Z",
        "__v": 0
    }
}
```  
`POST /api/rounds`  
Body:  
```
{
	"name":"Oklahoma Cup",
	"config":{
		"round_time_limit":50,
		"instance_time_limit":90,
		"instance_limit":1
	}
}
```
Resp:
```
{
    "status": 200,
    "message": "New round created"
}
```
_The above response should be what all the other responses look like._
### Instance
___
Each client that reports in will create an instance. The instance is assigned to a team in the round.  
**Schema**
```
{
    os_details:{
        hostname:{type:String, required:[true, 'Hostname required']},
        release: {type:String, required:[true, 'Os release required']},
        network:{
            ip_addr: {type:String, required:[true, 'Ip address required for communication']},
            hw_addr: {type:String, required:[true, 'Hardware (mac) address required for super secret spy stuff ;)']}
        }
    },
    scoring_config: Object,
    team: {type: String, ref: 'Teams', default:null},
    score: {
        current: Number,
        previous: Number
    },
    uid: String,
    running: {type:Boolean, default:false},
    round: {type: String, ref: 'Rounds', default:null}
}
```
`GET /api/instances?key=value`  
As of of now you have the ability to search for any key/value pair that is in the document. This also enabled you to refine searches to match multiple parameters.   

_Adding `verbose=true` to the url will resolve the team ObjectID to the respective document._  

`POST /api/instances`
All of the parameters that are here will get gathered during the checkin process that each client does. If `team` or `round` is not passed then it will get set to null. This allows for independent users who want to practice without any team affilation or round scoring.     
Body:  
```
{
	"os_details":{
		"hostname":"Cyberpatriot_practice01",
		"release":"Ubuntu",
		"network":{
			"ip_addr":"127.0.0.1",
			"hw_addr":"TH:IS:0I:S0:HE:X0"
		}
	},
	"scoring_config": "WIP",
	"team":"test2",
	"round":"Oklahoma Cup"
}
```  
Resp:  
```
{
    "status": 200,
    "instance": {
        "os_details": {
            "network": {
                "ip_addr": "127.0.0.1",
                "hw_addr": "TH:IS:0I:S0:HE:X0"
            },
            "hostname": "Cyberpatriot_practice01",
            "release": "Ubuntu"
        },
        "team": "test2",
        "running": false,
        "round": "Oklahoma Cup",
        "_id": "5e0c05162ec8b41973b6f508",
        "scoring_config": "WIP",
        "uid": "cc3bc27b-4079-4d3b-a912-5b358c4f2fe1",
        "createdAt": "2020-01-01T02:33:58.765Z",
        "updatedAt": "2020-01-01T02:33:58.765Z",
        "__v": 0
    }
}
```
### Team
___
Teams are created to aggregate instances to a group of users. Ideally this will be a CyberPatriot team.  
  
**Schema**
```
{
    team_name: {type:String, require:[true, "Team name required to create a team"]},
    team_number: {type:String},
    uid: String,
    instances: [
        {type: mongoose.Schema.Types.ObjectId, ref:'Instances'}
    ], 
}
```

`GET /api/teams?key=value`  
As of of now you have the ability to search for any key/value pair that is in the document. This also enabled you to refine searches to match multiple parameters.   

_Adding `verbose=true` to the url will resolve the instance ObjectID to the respective documents._  
Resp:  
```
{
    "status": 200,
    "team": {
        "instances": ['5df6c9d66f27482e1aa2f18b],
        "_id": "5e0c0d2234bebd225e474ff5",
        "team_name": "new_team",
        "team_number": "12364",
        "uid": "56e1c5f4-81d6-4d31-8152-22b3689b2440",
        "createdAt": "2020-01-01T03:08:18.987Z",
        "updatedAt": "2020-01-01T03:08:18.987Z",
        "__v": 0
    }
}
```

`POST /api/teams`  
Body:
``` 
{
	"team_name":"Test_team",
	"team_number":"OK-1234"
}
```  
Resp:
```
{
    "status": 200,
    "team": {
        "instances": [],
        "_id": "5e0c0d2234bebd225e474ff5",
        "team_name": "new_team",
        "team_number": "12364",
        "uid": "56e1c5f4-81d6-4d31-8152-22b3689b2440",
        "createdAt": "2020-01-01T03:08:18.987Z",
        "updatedAt": "2020-01-01T03:08:18.987Z",
        "__v": 0
    }
}
```  
Errors:  
```
{

}
```
