const express = require('express');

const router = express.Router();

const adminControlles = require("../../controllers/admins/admins")

// middlewares
const middleware = require("../../middlewares/auth")
const upload = require("../../utils/upload")

// admins routes
router.get('/me', middleware.authAdmin, adminControlles.getMe)
router.put('/update-profile/:adminId', middleware.authAdmin, adminControlles.updateProfile)
router.put('/update-avatar/:adminId', middleware.authAdmin, upload.single('avatar'), adminControlles.updateAvatar)

// admin routes for drivers
router.get("/drivers",middleware.authAdmin, adminControlles.getDrivers)
router.get("/drivers/:driverId",middleware.authAdmin, adminControlles.getDriver)
router.put("/drivers/:driverId/active-driver",middleware.authAdmin, adminControlles.activeDriver)
router.put("/drivers/:driverId/deactive-driver",middleware.authAdmin, adminControlles.deActiveDriver)

// admin routes for users
router.get("/users",middleware.authAdmin, adminControlles.getUsers)
router.get("/users/:userId",middleware.authAdmin, adminControlles.getUser)
// router.put("/users/:driverId/active-driver",middleware.authAdmin, adminControlles.activeDriver)
// router.put("/users/:driverId/deactive-driver",middleware.authAdmin, adminControlles.deActiveDriver)

// admin routes for buses
router.get("/buses",middleware.authAdmin, adminControlles.getBuses)
router.get("/buses/:busId",middleware.authAdmin, adminControlles.getBus)
// router.put("/buses/:driverId/active-driver",middleware.authAdmin, adminControlles.activeDriver)
// router.put("/buses/:driverId/deactive-driver",middleware.authAdmin, adminControlles.deActiveDriver)

module.exports = router;