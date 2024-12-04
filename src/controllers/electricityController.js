// ./src/controller/electricityController.js
const electricityService = require("../services/electricityService");
const apiError = require("../utils/apiError");


const consumption = async (req, res, next) => {
    try {
        const { userName } = req.body;
        const { type } = req.params;
        const data = await electricityService.consumption(userName, type);
        if(data) {
            return res.status(200).send(data);
        } else {
            return res.status(404).send({ message: "No data found" });
        }
    } catch (error) {
        next(error instanceof apiError ? error : new apiError(400, error.message));
    }
}


module.exports = {
    consumption,
}