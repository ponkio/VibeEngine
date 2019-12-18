const _ = require('lodash')
const Round_schema = require('../models/Round')
const logger = require('../../plugins/logger')
const uuid = require('uuid/v4')
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

        //This is just fucked, not too sure why, dont want to fix it right now
        /*
        let schema_keys = Object.keys(Round_schema.schema.paths);
        keys.map(key => {
            if(!schema_keys.includes(keys[key])) {
                logger.info({label:`getRound`, message:`Bad value passed: ${key}`})
                return callback({status:400, message:`Bad value passed: ${key}`})
            }
        });*/

        Round_schema.findOne(query, (err, round) => {
            if(err){
                logger.err({label:`getRound`, message:err})
                return callback({status:500, message:err});
            }
            logger.info({label:`getRound`, message:round})
            return callback({status:200, round:round})
        })
    }

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

    checkExisting(new_round, cb){
        Round_schema.findOne({"name":new_round.name}, (err, round) => {
            if(err){
                logger.error({label:`checkExisting`, message:err})
            }
            if(round) {
                cb(round)
            } else {
                cb()
            }
        });
        //console.log(existing_team)
        //logger.debug({label:`checkExisting`, message:`Existing Team: ${existing_team}`})
    }

    async create_round(req, callback){

        let passed_keys = this.getKeys(req.body);
        let required_keys = _.without(Object.keys(Round_schema.schema.paths), 'createdAt', 'updatedAt', 'uid', 'teams', '_id', '__v')
        if(!_.isEqual(_.sortBy(passed_keys), _.sortBy(required_keys))){
            logger.info({label:`create_new_instance`, message:`Missing / invalid value(s): ${_.xor(passed_keys, required_keys)}`})
            return callback({status: 400, message:`Missing / invalid value(s): ${_.xor(passed_keys, required_keys)}`})
        }

        let new_round = new Round_schema(req.body);
        new_round.uid = uuid();

        await this.checkExisting(new_round, (results, round) => {
            if(results){
                return callback({status:400, message:round});
            } else {
                new_round.save((err, round) => {
                    logger.info({label:`create_round`, message:`Creating a new round ${round}`})
                    if(!err){
                        return callback({status:201, round:round})
                    }
                })
            }
        });
    }
}

module.exports = Rounds_helper;