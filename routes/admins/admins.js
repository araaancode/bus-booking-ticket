const express = require('express');

const router = express.Router();

// middlewares
const middleware = require("../../middlewares/auth")

router.get("/",(req,res)=>{
    res.send('admin api')
})

module.exports = router;