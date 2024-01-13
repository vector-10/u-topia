const User = require('../models/authModels');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const ErrorHandler = require('../utils/errorHandler');

const createNewUser = catchAsyncErrors(async(req, res, next) => {
  // first we set the parameters needed from the user to the req.body
  const { firstName, middelName, lastName, dateOfBirth, gender, nationality, salutation, address, email,
     mobileNumber, password, confirmPassword, bvn, transferPin, maritalStatus, occupation,
      employmentStatus, sourceofIncome, city, state, accountNumber } = req.body;
      // to ensure the password and confirm password values are the same
      if(password !== confirmPassword){
        return next(new ErrorHandler ("Please ensure that password and confirmPassword match", 401))
      }
      // To ensure that the user does not already have an account with same email
      const checkIfEmailExists = await User.findOne({ email });
      if(checkIfEmailExists) {
        return next (new ErrorHandler(`User account with email ${checkIfEmailExists} already exists`))
      }

      //Now to auto assign admin role to first sign up, we check to see no of accouts existing. if equal to zero the accoutn is admin
      const firstAccount = await User.countDocuments({}) === 0;
      // Now we define the role for the account to the first sign up
      let role = firstAccount? "admin":"user";
      
      //Now we create a new user with database operations
      const user = await User.create({
        firstName, middelName, lastName, dateOfBirth, gender, nationality, salutation, address, email,
     mobileNumber, password, confirmPassword, bvn, transferPin, maritalStatus, occupation,
      employmentStatus, sourceofIncome, city, state, accountNumber
      })


      res.json({
        message: "User account creation successful",
        user,
      })

})


module.exports = {createNewUser}