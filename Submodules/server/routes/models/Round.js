const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Round_schema = new Schema(
    {
        name: String,
        uid: String,
        teams:[
            {
                team_id: {type:mongoose.Schema.Types.ObjectId, ref: 'Teams'},
                instance: [{type:mongoose.Schema.Types.ObjectId, ref: 'Instances'}]
            }
        ],
        config: {
            timeLimit: Date,
            instanceLimit: Number
        }
    },
    {timestamps:true}
)

module.exports = Round_schema;