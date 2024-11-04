// ./src/controllers/userController.js
const userAuthService = require("../services/userAuthService");
const apiError = require("../utils/apiError");


const signup = async (req, res, next) => {
    try {
        const {userName, password} = req.body;
        const {message, token} = await userAuthService.signup(userName, password);

        res.cookie('jwt', token, {
            httpOnly: true,
            secure: process.env.JWT_SECRET === 'production',
            maxAge: 3600000,
        });

        return res.status(200).json({message});
    } catch (error) {
        if(error instanceof apiError) {
            next(error);
        } else {
            next(new apiError(500, error.message));
        }
    }
}


module.exports = {signup, }