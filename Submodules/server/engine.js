const Round_schema = require('./routes/models/Round')
const logger = require('./plugins/logger')
const axios = require('axios')

class Engine{

    __score_instances(instances){
        instances.map((instance) => {
            logger.info({label:`__score_instance`, message:`Scoring instance: ${instance._id}`})
            axios.get(`http://${instance.os_details.network.ip_addr}:8000/.zshrc`)
            .then((resp) => {
                logger.debug({label:`__score_instance`, message:`Score recieved from ${instance.os_details.network.ip_addr}. Updating score in database...`})
                //console.log(resp)
            })
            .catch((err) => {
                //console.log(err)
            })
        })
    }

    
    start(cb){
        //This is kinda  dumb way to do it...but its using the best of both worlds...sync and async programming
        setTimeout(async () => {
            let running_rounds = await Round_schema.find({running:true}).populate('instances')
           
            //These for loops look kinda wonky
            
            for(let round of running_rounds) {
                var current_date = new Date()
                var mins_since_started = ((current_date - round.time_started)/1000)/60
                if(mins_since_started >= round.config.round_time_limit) {

                    logger.info({label:`Engine.Start`, message:`Round: ${round.name} has exceeded the time limit`})
                    Round_schema.findOneAndUpdate({name:round.name}, {running:false, completed:true}, {new:true}, (err, updated_round) => {
                        logger.info({label:`Engine.Start`, message:`Stoping round: ${updated_round.completed}`})
                    })
                }else {
                    logger.info({label:`Engine.Start`, message:`Scoring instances for round: ${round.name}`})
                    this.__score_instances(round.instances)
                }
                    
            }   
            //Did someone say recursion??
            this.start(cb);
            
        //Maybe this should have the ability to be changed when starting the server. 
        }, 5000)
    }
}

module.exports = new Engine;