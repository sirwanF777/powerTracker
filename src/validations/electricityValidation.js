// ./src/validations/electricityValidation.js
const Joi = require("joi");


const bodyValidationSchema = Joi.object({
    userName: Joi.string().min(3).max(30).required().messages({
        'string.base': 'Username must be a string',
        'string.empty': 'Username cannot be empty',
        'string.min': 'Username must be at least 3 characters',
        'any.required': 'Username is required',
    }),
});

const paramsValidationSchema = Joi.object({
    type: Joi.string().valid('hourly', 'daily', 'weekly', 'monthly').required().messages({
        'string.base': 'Type must be a string',
        'any.only': 'Type must be one of hourly, daily, weekly, or monthly',
        'any.required': 'Type is required',
    }),
});

const consumptionValidation = async (req, res, next) => {
    try {
        // const bodyError = bodyValidationSchema.validate(req.body);
        // if (bodyError.error) {
        //     return res.status(400).json({ message: bodyError.error.details[0].message });
        // }

        const paramsError = paramsValidationSchema.validate(req.params);
        if (paramsError.error) {
            return res.status(400).json({ message: paramsError.error.details[0].message });
        }

        next();
    } catch (error) {
        next(error instanceof apiError ? error : new apiError(400, error.message));
    }
};


module.exports = {
    consumptionValidation,
};