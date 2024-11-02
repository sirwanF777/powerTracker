// ./src/routers/index.js
const express = require('express');
const router = express.Router();
const userRouter = require("./userRouter");


router.use("/auth-user", userRouter);


module.exports = router;