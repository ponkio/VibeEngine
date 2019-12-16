const _ = require('lodash')
const Round_schema = require('../models/Round')
const logger = require('../../plugins/logger')
class Rounds_helper{

    getRound(query, callback) {
        //Values that can not be used to query for a round
        //Add this to Utils.js
        let invalid_vals = ['test', 'test2'];
        let invalid_list = [];
        let keys = Object.keys(query).map(val => {
            if(invalid_vals.includes(val)){
                invalid_list.push(val);
            }
        })
        if(invalid_list.length > 0){
            return callback({message:`Unable to perform query with the following keys`, invalid_keys:invalid_list});
        }

        let schema_keys = Object.keys(Round_schema.schema.paths);
        keys.map(key => {
            if(!schema_keys.includes(keys[key])) {
                logger.info({label:`getRound`, message:`Bad value passed: ${key}`})
                return callback({status:400, message:`Bad value passed: ${key}`})
            }
        });

        Round_schema.findOne(query, (err, round) => {
            if(err){
                logger.err({label:`getRound`, message:err})
                return callback({status:500, message:err});
            }
            logger.info({label:`getRound`, message:round})
            return callback({status:200, round:round})
        })
    }
}

module.exports = Rounds_helper;