// in this function, I will create and sign a jwt token for authentication.
const jwt = require('jsonwebtoken');

const sendToken = (user, statusCode, res) => {
    //sign jwt for wuth
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn : process.env.JWT_EXPIRATION,
    });

    //options for cookie
    const oneDay = 1000 * 60 * 60 * 24;
    const options ={
        expires: new Date(Date.now() + oneDay),
        httpOnly: true,
    };
    res.status(statusCode)
    .cookie("token", token, options)
    .json({
        success: true,
        token,
        user
    });
};

module.exports = sendToken;