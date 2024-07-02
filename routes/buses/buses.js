const express = require('express');

const router = express.Router();

const busControllers = require("../../controllers/buses/buses")

// middlewares
const driverMiddleware = require("../../middlewares/auth")

// upload bus image
const { busUpload } = require("../../utils/busImages")

router.get('/', busControllers.getAllBus)
router.get('/:busId', busControllers.getSingleBus)

router.post('/', driverMiddleware.authDriver, busUpload.fields([{
    name: "cover",
    maxCount: 1,
},
{
    name: "images",
    maxCount: 4,
},]), busControllers.createBus)


router.put('/update-bus/:busId', driverMiddleware.authDriver, busControllers.updateBus)
router.put('/update-bus-cover/:busId', driverMiddleware.authDriver, busUpload.single('cover'), busControllers.updateBusCover)
router.put('/update-bus-images/:busId', driverMiddleware.authDriver, busUpload.single('images'), busControllers.updateBusImages)


module.exports = router;