const Round_schema = require('./routes/models/Round')
const logger = require('./plugins/logger')
class Engine{
    start(cb){
        setTimeout(async () => {
            let running_rounds = await Round_schema.find({running:true}).populate('instances')
            //running_rounds.map((x) => {
              //  console.log(x.instances[0])
            //})
            let round
            for(round of running_rounds) {
                //console.log(round.instances)
            }
            this.start(cb);
            
        }, 5000)
    }
}

module.exports = new Engine;