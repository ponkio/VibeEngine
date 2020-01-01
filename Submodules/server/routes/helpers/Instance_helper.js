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

        //If team or round is provided then resolve the object IDs before searching
        //Should also be sanitized and also redact information...Just dont know what..yet..unless ;)
        Instance_schema.find(_.omit(query, 'verbose')).populate(((query.verbose) ? 'team':'')).populate(((query.verbose) ? 'round':'')).exec( (err, instance) => {
            if(err){
                logger.error({label:`getInstance`, message:err})
                return callback({status:500, message:err})
            } else if(!instance) {
                logger.info({label:`getInstance`, message:`Instance query with the following paramenters: ${JSON.stringify(query)}`})
                return callback({status:200, message:`No round found with the given parameters`})
            } else {
                logger.info({label:`getInstance`, message:`Instance query with the following paramenters: ${JSON.stringify(query)}`})
                return callback({status:200, isntance:instance})
            }
        })
    }

   // Removed getKeys since I no longer need the fake schema validation

    // Still needs to check for duplicate instances
    // A duplicate instance should be considered if(ip_addr && hw_addr && hostname in database)
    // ^ I need some other minds to brainstorm this with
    async create_new_instance(req, callback){

        let new_instance = new Instance_schema(req.body);
        new_instance.uid = uuid();

        new_instance.save((err, instance) => {
            if(err) {
                return callback({status:500, message:`Unable to create instance: ${err}`})
            }
            logger.info({label:`create_new_instance`, message:`New instance created: ${instance._id}`});
            return callback({status:200, instance:instance})
        })
    }

    //Gets ran when a client first checks in, where the round gets assigned to the instance
    client_checkin(req, callback) {
        console.log("Legit nothing happens yet cause I havent polished the already shat shit enough yet")
    }
}

module.exports = Instances_helper;