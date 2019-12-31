const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Round_schema = new Schema(
    {
        name: String,
        uid: String,
        running:Boolean,
        instances: [
            {type:mongoose.Schema.Types.ObjectId, ref:'Instances'}
        ],
        config: {
            round_time_limit: Date,
            instance_time_limit: Date,
            instance_limit: Number
        }
    },
    {timestamps:true}
)

module.exports = mongoose.model("Rounds", Round_schema);