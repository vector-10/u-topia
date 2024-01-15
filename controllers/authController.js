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
//reset password for user

//To get user profile
const getUserProfile = catchAsyncErrors(async(req, res, next) => {
  // introduce try catch block for efficient error  handling
  try {
    //extract the user id from the params
    const userId = req.params.userId;
    const user = await User.findById(userId);
    console.log();
    //validation to make sure that a user is found
    if(!user){
      return next(new ErrorHandler(`User with ID ${userId} does not exist on database`))
    }
    const userProfile = {
      _id: user._id,
      username: user.name,
      dateOfBirth: user.dateOfBirth,
      gender: user.gender,
      nationality: user.nationality,
      address: user.address,
      email: user.email,
      mobileNumber: user.mobileNumber,
      occupation: user.occupation,
      city: user.city,
      state: user.state,
    };
    
    // return the result in json
    res.status(200).json({
      messaage: "User Profile successfully found",
      userProfile
    })

  } catch (error) {
    console.error(error);
    return next(new ErrorHandler("User profile not successfully found", 500))
  }
})

// to update user password
const updatePassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  //chaeck previous user password
  const isMatched = await user.comparePassword(req.body.oldPassword);

  if (!isMatched) {
    return next(new ErrorHandler("old password is incorrect", 400));
  }
  user.password = req.body.password;
  await user.save();

  sendToken(user, 200, res);
});

// Now to update user profile
const UpdateProfile = catchAsyncErrors(async(req, res, next) => {
  const userUpdated = {
    name: req.body.name,
    email: req.body.email,
  };

  await User.findByIdAndUpdate(req.user.id, userUpdated, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    message: "Your student user profile has been updated!"
  });
});

const logoutUser = catchAsyncErrors(async(req, res, next) => {
  // inorder to logout users we have to expire the token stored in the cookie.
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  })
  res.status(200).json({
    success: true,
    message: "You are logged out successfully!"
  });

});



module.exports = {
  createNewUser,
  loginUser,
  getUserProfile,
  updatePassword,
  UpdateProfile,
  logoutUser
}