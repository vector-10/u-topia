const User = require('../models/authModels');
const jwt = require('jsonwebtoken');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');

const authenticatedUser = catchAsyncErrors(async(req, res, next) => {
  const { token } = req.cookies;

  if(!token) {
    return next(new ErrorHandler("User not authenticated, Login to access resource", 401))
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await User.findById(decoded.id);

  next();
})

module.exports = { authenticatedUser }