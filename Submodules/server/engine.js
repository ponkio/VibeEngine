const Round_schema = require('./routes/models/Round')
const logger = require('./plugins/logger')
class Engine{
    start(cb){
        setTimeout(async () => {
            let running_rounds = await Round_schema.find({running:true}, (err) => {
                if(err){
                    throw new Error(err)
                }
            })
            //console.log(running_rounds)
            this.start(cb);
        }, 5000)
    }
}

module.exports = new Engine;