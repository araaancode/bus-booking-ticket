const express = require('express');

const router = express.Router();

const indexPageAdminControllers = require("../../../controllers/pages/admins/index")

router.get('/', indexPageAdminControllers.index)
router.get('/login',  indexPageAdminControllers.login)
router.get('/register', indexPageAdminControllers.register)
router.get('/profile', indexPageAdminControllers.profile)

module.exports = router;