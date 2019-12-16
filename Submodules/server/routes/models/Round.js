const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Round_schema = new Schema(
    {
        name: String,
        uid: String,
        instances:[
            {
                instance_id: {type:mongoose.Schema.Types.ObjectId, ref: 'Instances'},
                team_id: {type:mongoose.Schema.Types.ObjectId, ref: 'Teams'}
            }
        ],
        config: {
            timeLimit: Date,
            instanceLimit: Number
        },

    }
)

module.exports = Round_schema;