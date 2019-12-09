const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Teams_schema = new Schema(
    {
        team_name: String,
        team_number: String,
        uuid: String,
        instances: Array, 
        rounds: Array
    },
    {timestamps: true}
)

module.exports = Teams = mongoose.model("Teams", Teams_schema)