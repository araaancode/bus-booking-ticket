const express = require('express');
const authController = require('../../controllers/admins/auth');

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/logout', authController.logout);



module.exports = router;