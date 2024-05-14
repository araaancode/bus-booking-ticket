const express = require('express');

const router = express.Router();

const busControllers = require("../../controllers/buses/buses")

// middlewares
const driverMiddleware = require("../../middlewares/auth")

router.post('/',driverMiddleware.authDriver,busControllers.createBus)
router.get('/my-bus',driverMiddleware.authDriver,busControllers.getBus)
router.put('/update-bus',driverMiddleware.authDriver,busControllers.updateBus)
router.put('/update-bus-cover',driverMiddleware.authDriver,busControllers.updateBusCover)
router.put('/update-bus-images',driverMiddleware.authDriver,busControllers.updateBusImages)


module.exports = router;