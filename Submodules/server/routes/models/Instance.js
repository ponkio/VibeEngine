const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Instance_schema = new Schema(
    {
        os_details:{
            hostname:String,
            release: String,
            ip: String
        },
        scoring_config: String,
        team: {
            _id: {type: mongoose.Schema.Types.ObjectId, ref: 'Teams'},
            team_name:String
        },
        score: {
            current: Number,
            previous: Number
        }
    },
    {timestamps: true}
)

module.exports = mongoose.model("Instances", Instance_schema);