// ./src/middleware/user/validateUser.js
const Joi = require('joi');
const apiError = require('../../utils/apiError');


const userValidationSignupSchema = Joi.object({
    userName: Joi.string().min(3).max(30).required().messages({
        'string.base': 'Username must be a string',
        'string.empty': 'Username cannot be empty',
        'string.min': 'Username must be at least 3 characters',
        'any.required': 'Username is required',
    }),
    password: Joi.string()
        .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{6,}$'))
        .required()
        .messages({
            'string.base': 'Password must be a string',
            'string.empty': 'Password cannot be empty',
            'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
            'any.required': 'Password is required',
        }),
    email: Joi.string().email().required().messages({
        'string.base': 'Email must be a string',
        'string.empty': 'Email cannot be empty',
        'string.email': 'Email must be a valid email address',
        'any.required': 'Email is required',
    }),
});

const userValidationLoginSchema = Joi.object({
    userName: Joi.string().min(3).max(30).required().messages({
        'string.base': 'Username must be a string',
        'string.empty': 'Username cannot be empty',
        'string.min': 'Username must be at least 3 characters',
        'any.required': 'Username is required',
    }),
    password: Joi.string()
        .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{6,}$'))
        .required()
        .messages({
            'string.base': 'Password must be a string',
            'string.empty': 'Password cannot be empty',
            'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
            'any.required': 'Password is required',
        })
});


const userValidateSignup = async (req, res, next) => {
    try {
        const {error} = await userValidationSignupSchema.validate(req.body);
        if(error) {
            return res.status(400).json({ message: error.details[0].message });
        } else {
            next();
        }
    } catch (error) {
        next(error instanceof apiError ? error : new apiError(500, error.messages));
    }
}

const userValidateLogin = async (req, res, next) => {
    try {
        const {error} = userValidationLoginSchema.validate(req.body);
        if(error) {
            res.status(401).json({ message: error.details[0].message });
        } else {
            next();
        }
    } catch (error) {
        next(error instanceof apiError ? error : new apiError(500, error.message));
    }
}


module.exports = {
    userValidateSignup,
    userValidateLogin,
};