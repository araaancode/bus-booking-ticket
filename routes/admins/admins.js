const express = require('express');

const router = express.Router();

// middlewares
const middleware = require("../../middlewares/auth")

const driverControlles=require("../../controllers/admins/admins")

router.get("/drivers",driverControlles.getDrivers)

module.exports = router;