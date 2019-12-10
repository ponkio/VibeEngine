const express = require('express');
const router = express.Router();
const Instace_helper = require('../helpers/Instance_helper');

const helper = new Instace_helper()

router.get('/', (req, res) => {
    helper.getInstance(req.query, (result) => {
        if(result){
            return res.json(result)
        }
    })
});

router.post('/', (req, res) => {
    helper.create_new_instance(req, (result) => {
        if(result){
            return res.json(result)
        }
    })
});

module.exports = router;