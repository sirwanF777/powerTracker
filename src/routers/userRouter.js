// ./src/routers/userRouter.js
const express = require('express');
const router = express.Router();
const logger = require('../config/logger');

const {
    signup,
    login,
    logout,
} = require("../controllers/userController");
const { preventSignupIfLoggedIn, verifyToken, } = require("../middlewares/user/userAuthMiddleware");
const validateUser = require('../middlewares/user/validateUser');


router.post(
    "/signup",
    [preventSignupIfLoggedIn, validateUser, signup]
);

router.post("/login", (req, res) => {
    logger.http(`Request(POST) Was Successfull.`);
    res.send({
        message: `Request(POST) Was Successfull.`
    });
});

router.post("/logout", [verifyToken, logout]);


module.exports = router;