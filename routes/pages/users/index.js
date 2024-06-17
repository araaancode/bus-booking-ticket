const express = require('express');

const router = express.Router();

const indexPageControllers = require("../../../controllers/pages/users/index")

const { isLogin, forwardAuth, setHomeJwt } = require("../../../middlewares/auth")

router.get('/', setHomeJwt, indexPageControllers.index)
router.get('/login', forwardAuth, indexPageControllers.login)
router.get('/register', forwardAuth, indexPageControllers.register)
router.get('/profile', isLogin, indexPageControllers.profile)
router.get('/search-tickets', isLogin, indexPageControllers.searchTickets)

module.exports = router;