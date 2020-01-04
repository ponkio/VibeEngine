const _ = require('lodash')
const Round_schema = require('../models/Round')
const logger = require('../../plugins/logger')
const uuid = require('uuid/v4')
class Rounds_helper{

   //GET 
    getRound(query, callback) {
        //Values that can not be used to query for a round
        //Add this to Utils.js
        let invalid_vals = ['test', 'test2'];
        let invalid_list = [];
        Object.keys(query).map(val => {
            if(invalid_vals.includes(val)){
                invalid_list.push(val);
            }
        })
        if(invalid_list.length > 0){
            return callback({message:`Unable to perform query with the following keys`, invalid_keys:invalid_list});
        }

        //The populate function will only resolve the object IDs if verbose=true
        //Pretty proud of that functions ngl
        Round_schema.findOne(_.omit(query, 'verbose')).populate(((query.verbose) ? 'instances':'')).exec( (err, round) => {
            if(err){
                //I really hate if statements...I dont wanna use them :'(
                logger.err({label:`getRound`, message:err})
                return callback({status:500, message:err})
            } else if(!round) {
                logger.info({label:`getRound`, message:`Round query with the following parameters: ${JSON.stringify(query)}`})
                return callback({status:200, message:`No round found with the given parameters`})
            } else {
                logger.info({label:`getRound`, message:`Round query with the following parameters: ${JSON.stringify(query)}`})
                return callback({status:200, round:round})
            }
        })
    }

    //POST /api/round
    async create_round(req, callback){
        //Holy Shit moving the validation to the model removed so much code...
        //As Clark once said "Some programmers brag about the low line count their program is"
        //Fuck those guys

        let new_round = new Round_schema(req.body);
        new_round.uid = uuid();
    
        //This took so long to actually implement but damn is it cool
        //Logic is taking place in the middleware in ../models/Round.s
        new_round.save((err) => {
            if(err) {
                return callback({status:500, message:`Unable to create round: ${err}`})
            } else {
                return callback({status:200, message:"New round created"})
            }
        })

        
    }

    //POST /api/rounds/:round/start
    start_round(params, callback) {

        //This query works but the error message isnt as good. Maybe 2 queries might be the way to go for this
        //Or crazy concept...but put it in some sort of middleware/schema function]
        
        Round_schema.findOne({name:params.name},(err, round) => {
            //console.log(round)
            //Classic if statement checks again...ugh
            if(!round) {
                return callback({status:400, message:`Round ${params.name} not found!`});
            } else if(round.running == true) {
                return callback({status:200, message: `Round ${round.name} is already running`})
            } else if (round.completed == true) {
                return callback({status:200, message:`Round ${round.name} has been completed already`})
            } else {
                //This is an interesting way to do this
                round.updateOne({running:true, time_started:new Date()}, (err) => {
                    if(err) {
                        return callback({status:500, message:err})
                    }
                })
                return callback({status: 200, message:`Round ${params.name} started`})
            };

        })
    };


    stop_round(params, callback) {
        Round_schema.findOneAndUpdate({name:params.name}, {running:false}, (err, round) => {
            return callback({status: 200, message:`Round ${params.name} has been stopped`})
        })
    }
}

module.exports = Rounds_helper;