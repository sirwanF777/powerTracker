// ./src/routers/index.js
const express = require('express');
const router = express.Router();

const userRouter = require("./userRouter");
const eletricityRouter = require("./electricityRouter");


router.use("/auth-user", userRouter);
router.use("/electricity", eletricityRouter);


module.exports = router;