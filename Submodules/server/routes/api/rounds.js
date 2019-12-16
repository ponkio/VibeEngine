const express = require('express');
const router = express.Router();
const Round_helper = require('../helpers/Rounds_helper')

var helper = new Round_helper();


router.get('/', (req, res) => {
    helper.getRound(req.query, (result) => {
        return res.json(result)
    })
});

router.post('/', (req, res) => {
    return res.json({success: true, message:"POST"})
});

module.exports = router;