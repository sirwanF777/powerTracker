// ./src/routers/userRouter.js
const express = require('express');
const router = express.Router();
const logger = require('../config/logger');

const {
    signup,
    login,
    logout,
} = require("../controllers/userAuthController");
const { preventSignupIfLoggedIn, preventDuplicateLogin, verifyToken, } = require("../middlewares/userAuthMiddleware");
const { userValidateSignup, userValidateLogin } = require('../validations/userAuthValidation');


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