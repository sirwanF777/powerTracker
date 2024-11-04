// ./src/routers/userRouter.js
const express = require('express');
const router = express.Router();
const logger = require('../config/logger');

const { signup, } = require("../controllers/userController");


router.post(
    "/signup",
    [signup]
);

router.post("/login", (req, res) => {
    logger.http(`Request(POST) Was Successfull.`);
    res.send({
        message: `Request(POST) Was Successfull.`
    });
});


module.exports = router;