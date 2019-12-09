const express = require('express');
const router = express.Router();


router.get('/', (req, res) => {
    return res.json({sucess:true, message:"GET"})
});

router.post('/', (req, res) => {
    return res.json({success: true, message:"POST"})
});

module.exports = router;