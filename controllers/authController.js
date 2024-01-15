const User = require('../models/authModels');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const ErrorHandler = require('../utils/errorHandler');
const sendToken = require('../utils/jwtToken');
const assignAccountNumber = require('../utils/accountNumber');

const createNewUser = catchAsyncErrors(async(req, res, next) => {
  // first we set the parameters needed from the user to the req.body
  const { firstName, middleName, lastName, dateOfBirth, gender, nationality, salutation, address, email,
     mobileNumber, password, confirmPassword, bvn, transferPin, maritalStatus, occupation,
      employmentStatus, sourceofIncome, city, state} = req.body;

      // to ensure the password and confirm password values are the same
      if(password !== confirmPassword){
        return next(new ErrorHandler ("Please ensure that password and confirmPassword match", 403))
      }
      // To ensure that the user does not already have an account with same email
      const checkIfEmailExists = await User.findOne({ email });
      if(checkIfEmailExists) {
        return next (new ErrorHandler(`User account with email ${email} already exists`, 401))
      }

      //Now to auto assign admin role to first sign up, we check to see no of accouts existing. if equal to zero the accoutn is admin
      const firstAccount = await User.countDocuments({}) === 0;
      // Now we define the role for the account to the first sign up
      let role = firstAccount? "admin":"user";

      try {
          // in the actual application, I can only refer to name for ease of state
      const name = `${firstName} ${middleName} ${lastName} `
      // console.log(name);
        //Generate and assing account Number on user sign up
        const accountNumber = await assignAccountNumber();
        // console.log(accountNumber);
      //Now we create a new user with database operations
      const user = await User.create({
        name, dateOfBirth, gender, nationality, salutation, address, email,
     mobileNumber, password, bvn, transferPin, maritalStatus, occupation,
      employmentStatus, sourceofIncome, city, state, accountNumber, role
      });
      
      sendToken(user, 201, res)        
      } catch (error) {
        console.log(error);
        return next(new ErrorHandler("Error creating new user account:", 500))
      }
     
});

const loginUser = catchAsyncErrors(async(req, res, next) => {
  // first we set login credentials to he used on signup
  const { email, password } = req.body;
  //check to ensure email and password are provided
  if(!email || !password) {
    return next(new ErrorHandler("Please provide your email and password to login", 400));
  }
  // to ensure user already has an account 
  const user = await User.findOne({ email }).select('+password');
  if(!user) {
    return next(new ErrorHandler("Invalid Email provided", 401));
  }

  // check to see if the password correctly matches
  const isPasswordCorrect = await user.comparePassword(password);
  if(!isPasswordCorrect) {
    return next(new ErrorHandler("Invalid password provided", 401));
  }
  //once we are sure of everything, we can then login in the user
  sendToken(user, 200, res);
});

//forgotPassword



module.exports = {
  createNewUser,
  loginUser
}