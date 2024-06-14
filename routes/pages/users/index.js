const express = require('express');

const router = express.Router();

const indexPageControllers = require("../../../controllers/pages/users/index")

const { isLogin, forwardAuth, setHomeJwt } = require("../../../middlewares/auth")

router.get('/', indexPageControllers.index)
router.get('/login', forwardAuth, indexPageControllers.login)
router.get('/register', forwardAuth, indexPageControllers.register)
router.get('/profile', isLogin, indexPageControllers.profile)

module.exports = router;