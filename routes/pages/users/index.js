const express = require('express');

const router = express.Router();

const indexPageControllers=require("../../../controllers/pages/users/index")

router.get('/',indexPageControllers.index)
router.get('/login',indexPageControllers.login)
router.get('/register',indexPageControllers.register)
router.get('/profile',indexPageControllers.profile)

module.exports = router;