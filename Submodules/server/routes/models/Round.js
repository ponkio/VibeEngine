const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Round_schema = new Schema(
    {
        name: String,
        uid: String,
        teams:[
            {
                team: {type:mongoose.Schema.Types.ObjectId, ref: 'Teams'},
                running_instances: [{type:mongoose.Schema.Types.ObjectId, ref: 'Instances'}]
            }
        ],
        config: {
            timeLimit: Date,
            instanceLimit: Number
        }
    },
    {timestamps:true}
)

module.exports = mongoose.model("Rounds", Round_schema);