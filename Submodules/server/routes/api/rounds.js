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
    helper.start_round(req.params, (result) => {
        return res.json(result)
    })
})

router.post('/:name/stop', (req, res) => {
    helper.stop_round(req.params, (result) => {
        return res.json(result);
    })
})

module.exports = router;