const express = require('express');

const router = express.Router();

const userControllers = require("../controllers/users/users")

// middlewares
const middleware = require("../middlewares/auth")

router.get('/me',middleware.authUser,userControllers.getMe)
router.put('/update-profile/:userId',userControllers.updateProfile)
router.put('/update-avatar/:userId',userControllers.updateAvatar)
router.post('/send-message',userControllers.sendMessage)
router.get('/my-tickets',userControllers.myTickets)
router.put('/cancle-ticket/:ticketId',userControllers.cancleTicket)
router.get('/search-ticket',userControllers.searchTickets)
router.post('/book-ticket',userControllers.bookTicket)


module.exports = router;