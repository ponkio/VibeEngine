const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Instance_schema = new Schema(
    {
        os_details:{
            hostname:String,
            release: String,
            network:{
                ip: String,
                mac: String
            }
        },
        scoring_config: Object,
        team: {type: mongoose.Schema.Types.ObjectId, ref: 'Teams'},
        score: {
            current: Number,
            previous: Number
        },
        uid: String,
        running: Boolean,
        round: {type: mongoose.Schema.Types.ObjectId, ref: 'Rounds'}
    },
    {timestamps: true}
)

module.exports = mongoose.model("Instances", Instance_schema);