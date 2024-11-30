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
const { userValidateSignup, userValidateLogin } = require('../middlewares/user/userValidate');


router.post(
    "/signup",
    [preventSignupIfLoggedIn, userValidateSignup, signup]
);

router.post(
    "/login",
    [preventDuplicateLogin, userValidateLogin, login]
);

router.post("/logout", [verifyToken, logout]);


module.exports = router;