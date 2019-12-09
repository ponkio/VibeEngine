const config={
    "endpoints":[ 
        {
            "name":"Teams",
            "route":"/api/teams",
            "app_path":"./routes/api/teams"
        },
        {
            "name":"Instances",
            "route":"/api/instances",
            "app_path":"./routes/api/instances"
        },
        {
            "name":"Rounds",
            "route":"/api/rounds",
            "app_path":"./routes/api/rounds"
        }
    ],
    "globals":{
        "mongodb":"mongodb://localhost:27017/VibeEngine",
        "logging":{
            "path":"./logs",
            "level":"debug",
            "maxSize":"5m",
            "maxFiles":"100"
        }
    }
}

module.exports = config;