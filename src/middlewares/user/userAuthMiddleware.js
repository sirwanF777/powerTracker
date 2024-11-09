// ./src/middlewares/user/userAuthMiddleware.js
const jwt = require('jsonwebtoken');
const apiError = require('../../utils/apiError');


const preventSignupIfLoggedIn = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if (token) {
            jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
                if (err) {
                    res.clearCookie("jwt");
                    next();
                } else {
                    return res.status(401).json({ message: `Already Logged In.` });
                }
            });
        } else {
            next();
        }
    } catch (error) {
        next(error instanceof apiError ? error : new apiError(500, error.message));
    }
};

const preventDuplicateLogin = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if(token){
            jwt.verify(token, process.env.JWT_SECRET, (err) => {
                if(err) {
                    req.clearCookie("jwt");
                    next();
                } else {
                    res.status(401).json({
                        message: `You Are Already Logged In. Please Log Out First.`
                    });
                }
            })
        } else {
            next();
        }
    } catch (error) {
        next(error instanceof apiError ? error : new apiError(500, error.message));
    }
}

const verifyToken = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if(token) {
            jwt.verify(token, process.env.JWT_SECRET, (err) => {
                if(err) {
                    return res.status(401).json({ message: err.message });
                } else {
                    next();
                }
            })
        } else {
            return res.status(401).json({ message: `You Are Not Logged In.` });
        }
    } catch (error) {
        next(error instanceof apiError ? error : new apiError(500, error.message));
    }
}


module.exports = {
    preventSignupIfLoggedIn,
    preventDuplicateLogin,
    verifyToken
}