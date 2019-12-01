# VibeEngine

## Round
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

## Instance
Each client that reports in will create an instance. The instance is assigned to a team in the round
```
{
    "_id":ObjectID,
    "uid":uuid,
    "scoringConf":{
        <WIP>
    }
}
```

## Team
Each client will be associated with a team or assigned an empty team
```
{
    "_id":ObjectID,
    "uid":uuid,
    "name":String,
    
}
```