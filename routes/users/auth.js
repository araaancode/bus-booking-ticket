const express = require('express');
const authController = require('../../controllers/users/auth');

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.post('/send-otp', authController.sendOtp);
router.post('/verify-otp', authController.verifyOtp);



module.exports = router;