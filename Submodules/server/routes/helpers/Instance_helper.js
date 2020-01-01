const _ = require('lodash');
const Instance_schema = require('../models/Instance');
const Round_schema = require('../models/Round')
const Team_schema = require('../models/Team');
const logger = require('../../plugins/logger');
const uuid = require('uuid/v4');

class Instances_helper {
    
    //Verbose setting to collect all the information (gathers the documents and not just the OID)
    getInstance(query, callback){
        //Move this to some sort of ../../plugins/utils.js class
        let keys =  _.without(Object.keys(query), 'verbose');
        let compare = Object.keys(Instance_schema.schema.paths);
        for(var i in keys){
            let compare_val = keys[i];
            if(!compare.includes(compare_val)) {
                logger.warn({label:`getInstance`, message:`Bad value passed: ${compare_val}`})
                return callback({status:400, message:`Bad value passed: ${compare_val}`})
            }
        }

        //Should also be sanitized and also redact information...Just dont know what..yet..unless ;)
        Instance_schema.findOne(_.omit(query, 'verbose')).populate(((query.verbose) ? 'team':'')).exec( (err, instance) => {
            if(err){
                //This error should be tested
                //Also maybe some sort of utils.js class to handle errors???
                logger.err({label:`getInstance`, message:err})
                return callback({status:500, message:err})
            }
            logger.info({label:`getInstance`, message:instance})
            return callback({status:200, instance:instance})
        })
    }

   // Removed getKeys since I no longer need the fake schema validation

    // Still needs to check for duplicate instances
    // A duplicate instance should be considered if(ip_addr && hw_addr && hostname in database)
    // ^ I need some other minds to brainstorm this with
    async create_new_instance(req, callback){

        /* DO NOT LOOK AT THESE COMMENTS ANYMORE
        ONLY HERE TO BUFF THE LINE NUMBERS


        //Only allow for required args
        //Once again...maybe a utils.js function
        //Crazy how redunadnt my code is :/
        // This is fucked for nested objects like at all :/

        // This is getting changed to be done with the built in validator in mongoose schemas
        // Crazy concept..but like what if I just used BUILT IN funcitons instead of recreating the wheel??
        
        let passed_keys = this.getKeys(req.body);
        console.log(passed_keys)
        let required_keys = _.without(Object.keys(Instance_schema.schema.paths), '_id','team._id','uid','score', 'score.current', 'score.previous','updatedAt','createdAt','__v')
        console.log(required_keys)
        if(!_.isEqual(_.sortBy(passed_keys), _.sortBy(required_keys))) {
            logger.info({label:`create_new_instance`, message:`Missing / invalid value(s): ${_.xor(passed_keys, required_keys)}`})
            //return callback({status:400, message:`Missing / invalid value(s): ${_.xor(passed_keys, required_keys)}`})
        }
        */

        // idk but I feel like this can be done a _little_ better
        let team = await Team_schema.findOne({team_name:req.body.team.team_name}, (err) => {
            if(err){
                throw new Error(err);
            }
        });

        if(!team) {
            //Need to return the callback so it doesnt try to read _.id from a null object
            return callback({status:400, message:`Unable to assign team to instance: Team not found`})
        }

        let round = await Round_schema.findOne({name:req.body.round}, (err) => {
            if(err) {
                throw new Error(err);
            }
        })
        
        let new_instance = new Instance_schema(req.body);
        new_instance.uid = uuid();
        //new_instance.team needs to have the some of the team object like name AND ._id...maybe..who knows I'm not database engineer
        new_instance.team = team;
        new_instance.round = round;
        //team.instances.push(new_instance);
        //team.save()

        new_instance.save((err, instance) => {
            if(err) {
                return callback({status:500, message:err.message})
            }
            logger.info({label:`create_new_instance`, message:`New instance created: ${instance._id}`});
            
            if(team){
                Team_schema.findOneAndUpdate({_id:team._id}, {$push:{instances:instance}}, {new:true},(err, new_team) => {
                    instance.team = new_team._id;
                    return callback({status:200, message:[instance, round]})
                })  
            }

            //When updating a document that is referencing please for the love of god push the entire document and not just the ._id
            //While pushing the ._id will work its just kinda gross...Not that everything else in this ISNT gross but still
            if(round){
                Round_schema.findOneAndUpdate({_id:round._id}, {$push:{instances:instance._id}}, (err, round) => {
                    if(err) {
                        return callback({status:500, message:err})
                    }
                })
            }
 
        })
    }

    //Gets ran when a client first checks in, where the round gets assigned to the instance
    client_checkin(req, callback) {
        console.log("Legit nothing happens yet cause I havent polished the already shat shit enough yet")
    }
}

module.exports = Instances_helper;