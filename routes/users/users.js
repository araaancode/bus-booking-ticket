const express = require('express');

const router = express.Router();

const userControllers = require("../../controllers/users/users")

// middlewares
const middleware = require("../../middlewares/auth")

const upload = require("../../utils/upload")

router.get('/all-drivers',userControllers.getDrivers)
router.get('/me', middleware.authUser, userControllers.getMe)
router.put('/update-profile/:userId', middleware.authUser, userControllers.updateProfile)
router.put('/update-avatar/:userId', middleware.authUser, upload.single('avatar'), userControllers.updateAvatar)
router.post('/send-message', middleware.authUser, userControllers.sendMessage)
router.get('/my-tickets', middleware.authUser, userControllers.myTickets)
router.put('/cancel-ticket/:ticketId', middleware.authUser, userControllers.cancelTicket)
router.post('/search-ticket',  userControllers.searchTickets)
router.post('/book-ticket', middleware.authUser, userControllers.bookTicket)



module.exports = router;