const express = require('express');

const router = express.Router();

const driverController = require("../../controllers/drivers/drivers")

// middlewares
const middleware = require("../../middlewares/auth")


router.get('/me', middleware.authDriver, driverController.getMe)
router.put('/update-profile/:driverId', middleware.authDriver, driverController.updateProfile)


// driver bus crud
router.get('/my-bus', middleware.authDriver, driverController.myBus)

router.get('/my-travels', middleware.authDriver, driverController.myTravels)
router.get('/get-driver-passengers', middleware.authDriver, driverController.getDriverPassengers)
router.put('/cancel-travel', middleware.authDriver, driverController.cancelTravel)
router.get('/get-income', middleware.authDriver, driverController.getIncome)
router.get('/get-reservations', middleware.authDriver, driverController.getReservation)


module.exports = router;