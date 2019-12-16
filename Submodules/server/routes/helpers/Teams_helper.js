const _ = require('lodash');
const Teams_schema = require('../models/Team');
const logger = require('../../plugins/logger');
const uuid = require('uuid/v4');

class Teams_helper {
    //This needs to restrict the output and not allow someone to query for uuid
    //Also needs to redact the team uuid and _id from the object before returnng
    getTeam(query, callBack){
        
        //If the query is empty then return null 
        let keys = _.without(Object.keys(query), 'verbose');
        let compare = Object.keys(Teams_schema.schema.paths);
        for(var i in keys){
            let compare_val = keys[i];
            if(!compare.includes(compare_val)) {
                logger.warn({label:`getTeam`, message:`Bad value passed: ${compare_val}`})
                return callBack({status:400, message:`Bad value passed: ${compare_val}`})
            }
        }
        
        // This needs to be sanitized much much much more
        // Populate is being used to resolve the Object IDs within Team.instances, this only took a week to finally understand
        Teams_schema.findOne(_.omit(query, 'verbose')).populate(((query.verbose) ? 'instances':'')).exec( (err, team) => {
            if(err){
                logger.error({label:`getTeam`, message:err});
                throw new Error(err);
            }
            logger.info({label:`getTeam`, message:"Returning teams"})
            callBack({status:200, message:team})
        });
        //logger.info({label:`getTeam`,message:"Returning Team"})
        //callBack({status:200, message:team})
    }

    checkExisting(new_team, cb){
        Teams_schema.findOne({$or:[{"team_name":new_team.team_name}, {"team_number":new_team.team_number}]}, (err, team) => {
            if(err){
                logger.error({label:`checkExisting`, message:err})
            }
            if(team) {
                cb(true)
            } else {
                cb(false)
            }
        });
        //console.log(existing_team)
        //logger.debug({label:`checkExisting`, message:`Existing Team: ${existing_team}`})
    }

    insertTeam(req, callback){

        //Only allow for required args
        let passed_keys = Object.keys(req.body);
        let required_keys = _.without(Object.keys(Teams_schema.schema.paths), '_id','uid','instances','rounds','updatedAt','createdAt','__v')
        if(!_.isEqual(_.sortBy(passed_keys), _.sortBy(required_keys))) {
            logger.info({label:`insertTeam`, message:`Missing / invalid value(s): ${_.xor(passed_keys, required_keys)}`})
            return callback({status:400, message:`Missing / invalid value(s): ${_.xor(passed_keys, required_keys)}`})
        }
       
        let new_team = new Teams_schema(req.body);
        new_team.uid = uuid();

        

        this.checkExisting(new_team, (results) => {
            if(results) {
                return callback({status:400, message:`Team already exists with same name or number`})
            } else {
                new_team.save((err, team) => {
                    logger.info({label:`insertTeam`, message:`Inserting new team: ${team}`})
                    return callback({status:201, team:team})
                });
            }
        })
        
    }
};

module.exports = Teams_helper;