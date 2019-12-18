const express = require('express');
const router = express.Router();
const Round_helper = require('../helpers/Rounds_helper')

var helper = new Round_helper();

//Get info on a round
router.get('/', (req, res) => {
    helper.getRound(req.query, (result) => {
        return res.json(result)
    })
});

//Create a round
router.post('/', (req, res) => {
    helper.create_round(req, (result) => {
        return res.json(result)
    })
});

//Start a round
router.post('/:name/start', (req, res) => {
    return res.json(req.params)
})

module.exports = router;