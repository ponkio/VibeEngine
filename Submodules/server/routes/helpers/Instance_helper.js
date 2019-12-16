const _ = require('lodash');
const Instance_schema = require('../models/Instance');
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

    //This definitly needs to be in Utils
    //Used to get the nested keys...Kinda like Object.keys but better
     getKeys(object) {
        function iter(o, p) {
            if (Array.isArray(o)) { return; }
            if (o && typeof o === 'object') {
                var keys = Object.keys(o);
                if (keys.length) {
                    keys.forEach(function (k) { iter(o[k], p.concat(k)); });
                }
                return;
            }
            result.push(p.join('.'));
        }
        var result = [];
        iter(object, []);
        return result;
    }

    // Still needs to check for duplicate instances
    // This duplicate will be based on hostname, IP address, Mac address, etc...
    async create_new_instance(req, callback){

        //Only allow for required args
        //Once again...maybe a utils.js function
        //Crazy how redunadnt my code is :/
        // This is fucked for nested objects like at all :/
        let passed_keys = this.getKeys(req.body);
        console.log(passed_keys)
        let required_keys = _.without(Object.keys(Instance_schema.schema.paths), '_id','team._id','uid','score', 'score.current', 'score.previous','updatedAt','createdAt','__v')
        console.log(required_keys)
        if(!_.isEqual(_.sortBy(passed_keys), _.sortBy(required_keys))) {
            logger.info({label:`create_new_instance`, message:`Missing / invalid value(s): ${_.xor(passed_keys, required_keys)}`})
            //return callback({status:400, message:`Missing / invalid value(s): ${_.xor(passed_keys, required_keys)}`})
        }

        let team = await Team_schema.findOne({team_name:req.body.team.team_name}, (err) => {
            if(err){
                throw new Error(err);
            }
        });

        if(!team) {
            //Need to return the callback so it doesnt try to read _.id from a null object
            return callback({status:400, message:`Unable to assign team to instance: Team not found`})
        }
        
        let new_instance = new Instance_schema(req.body);
        new_instance.uid = uuid();
        //new_instance.team needs to have the some of the team object like name AND ._id...maybe..who knows I'm not database engineer
        new_instance.team = team;

        //team.instances.push(new_instance);
        //team.save()
        new_instance.save((err, instance) => {
            logger.info({label:`create_new_instance`, message:`New instance created: ${instance._id}`});
            Team_schema.findOneAndUpdate({_id:team._id}, {$push:{instances:instance}}, {new:true},(err, new_team) => {
                instance.team = new_team._id;
                return callback({status:200, message:instance})
            });
      //return callback({status:200, message:instance})
        })
    }
}

module.exports = Instances_helper;