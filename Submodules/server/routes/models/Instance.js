const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Instance_schema = new Schema(
    {
        os_details:{
            hostname:{type:String, required:[true, 'Hostname required']},
            release: {type:String, required:[true, 'Os release required']},
            network:{
                ip_addr: {type:String, required:[true, 'Ip address required for communication']},
                hw_addr: {type:String, required:[true, 'Hardware (mac) address required for super secret spy stuff ;)']}
            }
        },
        scoring_config: Object,
        team: {type: mongoose.Schema.Types.ObjectId, ref: 'Teams', default:null},
        score: {
            current: Number,
            previous: Number
        },
        uid: String,
        running: {type:Boolean, default:false},
        round: {type: mongoose.Schema.Types.ObjectId, ref: 'Rounds', default:null}
    },
    {timestamps: true}
)

module.exports = mongoose.model("Instances", Instance_schema);