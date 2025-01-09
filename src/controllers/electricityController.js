// ./src/controller/electricityController.js
const logger = require("../config/logger");
const electricityService = require("../services/electricityService");
const apiError = require("../utils/apiError");

const consumption = async (req, res, next) => {
    try {
        const { userName } = req.body;
        const { type } = req.params;
        const { startDate, endDate } = req.query;

        logger.info(`API Request: GET /consumption - user=${userName}, type=${type}, startDate=${startDate || "N/A"}, endDate=${endDate || "N/A"}`);

        const data = await electricityService.consumption(userName, type, startDate, endDate);

        if (data) {
            logger.info(`API Response: 200 - user=${userName}, type=${type}, records=${data.length}`);
            return res.status(200).json(data);
        } else {
            logger.warn(`API Response: 404 - No data found for user=${userName}`);
            return res.status(404).json({ message: "No data found" });
        }
    } catch (error) {
        logger.error(`API Error: ${error.message}`);
        next(error instanceof apiError ? error : new apiError(400, error.message));
    }
};

module.exports = {
    consumption,
};
