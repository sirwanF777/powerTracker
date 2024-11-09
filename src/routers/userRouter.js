// ./src/routers/userRouter.js
const express = require('express');
const router = express.Router();
const logger = require('../config/logger');

const {
    signup,
    login,
    logout,
} = require("../controllers/userController");
const { preventSignupIfLoggedIn, preventDuplicateLogin, verifyToken, } = require("../middlewares/user/userAuthMiddleware");
const validateUser = require('../middlewares/user/validateUser');


router.post(
    "/signup",
    [preventSignupIfLoggedIn, validateUser, signup]
);

router.post(
    "/login",
    [preventDuplicateLogin, validateUser, login]
);

router.post("/logout", [verifyToken, logout]);


module.exports = router;