const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Instance_schema = new Schema(
    {
        os_details:{
            hostname:String,
            release: String,
            ip: String
        },
        scoring_config: Object,
        team: {type: mongoose.Schema.Types.ObjectId, ref: 'Teams'},
        score: {
            current: Number,
            previous: Number
        }
    },
    {timestamps: true}
)

module.exports = mongoose.model("Instances", Instance_schema);