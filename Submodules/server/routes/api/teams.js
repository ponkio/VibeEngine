const express = require('express');
const router = express.Router();
const Teams = require('../models/Teams');
const Teams_helper = require('../helpers/Teams_helper');

router.get('/', (req, res) => {
    return res.json({sucess:true, message:"GET"})
});

router.post('/', (req, res) => {
    return res.json({success: true, message:"POST"})
});

module.exports = router;