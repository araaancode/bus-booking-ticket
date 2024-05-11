const express = require('express');

const router = express.Router();

const userControllers = require("../controllers/users/users")

router.get('/me',userControllers.getMe)
router.put('/update-profile',userControllers.updateProfile)
router.put('/update-avatar',userControllers.updateAvatar)
router.post('/send-message',userControllers.sendMessage)
router.get('/my-tickets',userControllers.myTickets)
router.put('/cancle-ticket',userControllers.cancleTicket)
router.get('/search-ticket',userControllers.searchTickets)
router.post('/book-ticket',userControllers.bookTicket)


module.exports = router;