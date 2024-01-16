const User = require('../models/authModels');
const jwt = require('jsonwebtoken');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');

// this middleware ensure that only authenticated users can access particular resources
const authenticatedUser = catchAsyncErrors(async(req, res, next) => {
  const { token } = req.cookies;

  if(!token) {
    return next(new ErrorHandler("User not authenticated, Login to access resource", 401))
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await User.findById(decoded.id);

  next();
});


// this ensures that only users with certain roles can acess particular resources: Eg Admin
 const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if(!roles.includes(req.user.role)) {
      return next(new Errorhandler(`Role ${req.user.role} is not allowed to access this resource`, 403))
    }
    next();
  }
 }


module.exports = { authenticatedUser, authorizeRoles }