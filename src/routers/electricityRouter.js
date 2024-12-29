// ./src/routers/electricityRouter.js
const express = require('express');
const router = express.Router();
const electricityController = require("../controllers/electricityController");
const electricityValidation = require("../validations/electricityValidation");
const userAuthMiddleware = require("../middlewares/userAuthMiddleware");
const apiError = require("../utils/apiError");


router.get(
    "/consumption/:type",
    [
        userAuthMiddleware.verifyToken,
        electricityValidation.consumptionValidation,
        electricityController.consumption
    ]
);


module.exports = router;