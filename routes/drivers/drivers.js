const express = require('express');

const router = express.Router();

const driverController =  require("../../controllers/drivers/drivers")

// middlewares
const middleware = require("../../middlewares/auth")


router.get('/me',middleware.authDriver,driverController.getMe)
router.get('/see-my-bus',middleware.authDriver,driverController.seeBus)
router.get('/my-travels',middleware.authDriver,driverController.myTravels)
router.put('/update-bus',middleware.authDriver,driverController.updateBus)
router.put('/update-bus-cover',middleware.authDriver,driverController.updateBusCover)
router.put('/update-bus-images',middleware.authDriver,driverController.updateBusImages)
router.get('/get-driver-passengers',middleware.authDriver,driverController.getDriverPassengers)
router.put('/cancle-travel',middleware.authDriver,driverController.cancleTravel)
router.get('/get-income',middleware.authDriver,driverController.getIncome)
router.get('/get-reservations',middleware.authDriver,driverController.getReservation)

module.exports = router;