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
For each round is being grouped by teams. Each team has a list of running instances.  
**Schema**
```
{
    name: String,
    uid: String,
    teams:[
        {
            team: {type:mongoose.Schema.Types.ObjectId, ref: 'Teams'},
            running_instances: [{type:mongoose.Schema.Types.ObjectId, ref: 'Instances'}]
        }
    ],
    config: {
        timeLimit: Date,
        instanceLimit: Number
    }
}
```  
`GET /api/rounds?key=value`  
Resp:
```
```  
`POST /api/rounds`  
Body:  
```
```
Resp:
```
```

### Instance
Each client that reports in will create an instance. The instance is assigned to a team in the round.  
**Schema**
```
{
    os_details:{
        hostname:String,
        release: String,
        network:{
            ip: String,
            mac: String
        }
    },
    scoring_config: Object,
    team: {type: mongoose.Schema.Types.ObjectId, ref: 'Teams'},
    score: {
        current: Number,
        previous: Number
    },
    uid: String,
    running: Boolean,
    round: {type: mongoose.Schema.Types.ObjectId, ref: 'Rounds'}
}
```
`GET /api/instances?key=value`  
As of of now you have the ability to search for any key/value pair that is in the document. This also enabled you to refine searches to match multiple parameters.   

_Adding `verbose=true` to the url will resolve the team ObjectID to the respective document._  

`POST /api/instances`  
Body:  
```
{
	"os_details":{
		"hostname":"test_os",
		"release":"ArchLinux uWu",
		"network": {
            "ip":"192.168.0.69",
            "mac":"18:1d:ea:4c:48:ab"
        }
	},
	"scoring_config": "WIP",
	"team":{
		"team_name":"test2"
	},
    "round":"Oklahoma Cup"
}
```  
Resp:  
```
{
    "status": 200,
    "message": {
        "os_details": {
            "hostname": "test_os",
            "release": "ArchLinux uWu"
        },
        "_id": "5df6ea6c6c7db43f953f4f5e",
        "scoring_config": "WIP",
        "uid": "a80f7d8d-0a11-406c-b926-44c0dd2e5ff4",
        "round: "5df974eea7a5a05b3e7daa95",
        "team": "5def1511b4ba7c7ae6ffd5cf",
        "createdAt": "2019-12-16T02:22:36.743Z",
        "updatedAt": "2019-12-16T02:22:36.743Z",
        "__v": 0
    }
}
```
### Team
Each client will be associated with a team or assigned an empty team. 
  
**Schema**
```
{
    team_name: String,
    team_number: String,
    uid: String,
    instances: [
        {type: mongoose.Schema.Types.ObjectId, ref:'Instances'}
    ] 
}
```

`GET /api/teams?team_name=test2`  
As of of now you have the ability to search for any key/value pair that is in the document. This also enabled you to refine searches to match multiple parameters.  

_Adding `verbose=true` to the url will resolve the instance ObjectID to the respective documents._  
Resp:  
```
{
    "status": 200,
    "message": {
        "instances": [
            "5df6c673ea38742b6ad7218c",
            "5df6c6aef33fac2bdaeba489",
            "5df6c9d66f27482e1aa2f18b",
            "5df6ca32b7a5822ef9a2a25e",
            "5df6ca904d58872f56fa809d",
            "5df6cc69ef633e3252439a34"
        ],
        "_id": "5def1511b4ba7c7ae6ffd5cf",
        "rounds": [],
        "team_name": "test2",
        "team_number": "OK-124a0",
        "uid": "1d825ca7-dd09-4049-a8ed-a73300037962",
        "createdAt": "2019-12-10T03:46:25.131Z",
        "updatedAt": "2019-12-16T00:14:33.383Z",
        "__v": 1
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
    "status": 201,
    "message": "New team created {
        instances: [],
        _id: 5df6e6f32e74043a2da3fb22,
        team_name: 'Test_team',
        team_number: 'OK-1234',
        uid: 'f45d2e7b-08af-4df5-a0c7-7508593bfcf1',
        createdAt: 2019-12-16T02:07:47.687Z,
        updatedAt: 2019-12-16T02:07:47.687Z,
        __v: 0
    }"
}
```
