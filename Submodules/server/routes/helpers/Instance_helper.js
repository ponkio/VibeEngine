const _ = require('lodash');
const Instance_schema = require('../models/Instance');
const logger = require('../../plugins/logger');
const uuid = require('uuid/v4');

class Instances_helper {
    
    getInstance(query, callback){

        //Move this to some sort of ../../plugins/utils.js class
        let keys = Object.keys(query);
        let compare = Object.keys(Instance_schema.schema.paths);
        for(var i in keys){
            let compare_val = keys[i];
            if(!compare.includes(compare_val)) {
                logger.warn({label:`getInstance`, message:`Bad value passed: ${compare_val}`})
                return callBack({status:400, message:`Bad value passed: ${compare_val}`})
            }
        }

        //Should also be sanitized and also redact information...Just dont know what..yet..unless ;)
        Instance_schema.findOne(query, (err, instance) => {
            if(err){
                //This error should be tested
                //Also maybe some sort of utils.js class to handle errors???
                logger.err({label:`getInstance`, message:err})
                callback({status:500, message:err})
            }
            logger.info({label:`getInstance`, message:instance})
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

    create_new_instance(req, callback){

        //Only allow for required args
        //Once again...maybe a utils.js function
        //Crazy how redunadnt my code is :/
        // This is fucked for nested objects like at all :/
        let passed_keys = this.getKeys(req.body);
        let required_keys = _.without(Object.keys(Instance_schema.schema.paths), '_id','team._id','uid','score', 'score.current', 'score.previous','updatedAt','createdAt','__v')
        if(!_.isEqual(_.sortBy(passed_keys), _.sortBy(required_keys))) {
            logger.info({label:`create_new_instance`, message:`Missing / invalid value(s): ${_.xor(passed_keys, required_keys)}`})
            return callback({status:400, message:`Missing / invalid value(s): ${_.xor(passed_keys, required_keys)}`})
        }

        let new_instance = new Instance_schema(req.body);
        new_instance.uid = uuid();

        callback({status:200, message:new_instance})
    }
}

module.exports = Instances_helper;