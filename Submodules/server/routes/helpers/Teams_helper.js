const _ = require('lodash');
const Teams_schema = require('../models/Team');
const logger = require('../../plugins/logger');
const uuid = require('uuid/v4');

class Teams_helper {
    //This needs to restrict the output and not allow someone to query for uuid
    //Also needs to redact the team uuid and _id from the object before returnng
    getTeam(query, callback){
        
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
        Teams_schema.findOne(_.omit(query, 'verbose')).populate(((query.verbose) ? 'instances':'')).populate(((query.verbose) ? 'rounds':'')).exec( (err, team) => {
            if(err){
                //I really hate if statements...I dont wanna use them :'(
                logger.err({label:`getTeam`, message:err})
                return callback({status:500, message:err})
            } else if(!team) {
                logger.info({label:`getTeam`, message:`Team query with the following parameters: ${JSON.stringify(query)}`})
                return callback({status:200, message:`No team found with the given parameters`})
            } else {
                logger.info({label:`getTeam`, message:`Team query with the following parameters: ${JSON.stringify(query)}`})
                return callback({status:200, team:team})
            }
        })
    }



    create_new_team(req, callback){
       
        let new_team = new Teams_schema(req.body);
        new_team.uid = uuid();

        new_team.save((err, team) => {
            if(err) {
                return callback({status:500, message:`Unable to create new team: ${err}`})
            }
            logger.info({label:`create_new_team`, message:`New team created: ${team._id}`})
            return callback({status:200, team:team})
        })
    }
};

module.exports = Teams_helper;