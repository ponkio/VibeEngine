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
*Dont mind this, I dont feel like writing it right now*



### Round
Each round will have a database entry to show the following
```
{
    "_id":ObjectID
    "name":String,
    "uid":String,
    "teams":[
        {
            "name":String,
            "uid":String,
            "instances":[
                ObjectID,ObjectID
            ]
        },
        {
            "name":String,
            "uid":String,
            "instances":[
                ObjectID,ObjectID
            ]
        }
    ],
    "config":{
        "timeLimit":DateTime,
        "instanceLimit":Int,
    }
}
```

### Instance
Each client that reports in will create an instance. The instance is assigned to a team in the round
```
{
    "_id":ObjectID,
    "uid":uuid,
    "scoringConf":{
        <WIP>
    },
    "team":{
        "name":String,
        "uid":uuid
    }
    "score":{
        "current":Int,
        "previous":Int,
        "lastScored":DateTime
    }
}
```

### Team
Each client will be associated with a team or assigned an empty team
```
{
    "_id":ObjectID,
    "uid":uuid,
    "name":String,
    "rounds":[
        {
            "_id":ObjectID,
            "name":String
        }
    ]
    
}
```
