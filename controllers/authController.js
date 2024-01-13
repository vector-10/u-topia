const User = require('../models/authModels');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const ErrorHandler = require('../utils/errorHandler');

const createNewUser = catchAsyncErrors(async(req, res, next) => {
  // first we set the parameters needed from the user to the req.body
  const { firstName, middelName, lastName, dateOfBirth, gender, nationality, salutation, address, email,
     mobileNumber, password, confirmPassword, bvn, transferPin, role, maritalStatus, occupation,
      employmentStatus, sourceofIncome, city, state, accountNumber } = req.body;





})


module.exports = {createNewUser}