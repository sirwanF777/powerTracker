const express = require('express');
const router = express.Router();
const logger = require('../config/logger');


router.get("/", (req, res) => {
    logger.http(`Request(GET) Was Successfull.`);
    res.send({
        message: `Request(GET) Was Successfull.`
    });
});

router.post("/", (req, res) => {
    logger.http(`Request(POST) Was Successfull.`);
    res.send({
        message: `Request(POST) Was Successfull.`
    });
});


module.exports = router;