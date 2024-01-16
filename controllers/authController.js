const User = require('../models/authModels');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const ErrorHandler = require('../utils/errorHandler');
const sendToken = require('../utils/jwtToken');
const bcrypt = require('bcryptjs');
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
    //validation to make sure that a user is found
    if(!user){
      return next(new ErrorHandler(`User with ID ${userId} does not exist on database`))
    }
    // select the parameters to be sent to the client, to ensure security and protect information
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
      message: "User Profile successfully found",
      userProfile
    })
  } catch (error) {
    console.error(error);
    return next(new ErrorHandler("User profile not successfully found", 500))
  }
});

// Now to update user profile
const updateProfile = catchAsyncErrors(async(req, res, next) => {
   try {
      // set the userId to req.params.id
  const userId = req.params.userId;
  const user = await User.findById(userId);
  // ensure that user exists
  if(!user){
    return next(new ErrorHandler(`User with ID ${userId} not found for update`, 401))
  };
  //update user profile based on the fields you want to change
  user.firstName = req.body.firstName || user.firstName;
  user.middleName = req.body.middleName || user.middleName;
  user.lastName = req.body.lastname || user.lastName;
  user.dateOfBirth = req.body.dateOfBirth || user.dateOfBirth;
  user.gender = req.body.gender || user.gender;
  user.nationality = req.body.nationality || user.nationality;
  user.address = req.body.address || user.address;
  user.email = req.body.email || user.email;
  user.mobileNumber = req.body.mobileNumber || user.mobileNumber;
  user.occupation = req.body.occupation || user.occupation;
  user.city = req.body.city || user.city;
  user.state = req.body.state || user.state;
  user.employmentStatus = req.body.employmentStatus || user.employmentStatus;

   // Save the updated user
   await user.save();
   //return the updated parameters
   res.status(200).json({
    message: "User Profile successfully updated",
    userProfile: {
      _id: user._id,
      username: user.name,
      dateOfBirth: user.dateOfBirth,
      gender: user.gender,
      nationality: user.nationality,
      address: user.address,
      email: user.email,
      mobileNumber: user.mobileNumber,
      occupation: user.occupation,
      employmentStatus: user.employmentStatus,
      city: user.city,
      state: user.state,
    },
  });
   } catch (error) {
    return next(new ErrorHandler("Error updating user profile", 500));
   }
});

// Update password route
const updatePassword = catchAsyncErrors(async(req, res, next) => {
  try {
    const { currentPassword, newPassword, confirmNewPassword } = req.body;

    // Validate if newPassword and confirmNewPassword match
    if (newPassword !== confirmNewPassword) {
      return next(new ErrorHandler("New password and confirm new passwords do not match", 401));
    }

    // Fetch the user from the database
    const userId = req.params.userId;
    const user = await User.findById(userId);
    //console.log(user);

    // Validate the current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      return next(new ErrorHandler(`Please enter a new password`, 401));
    }
    // Hash the new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    user.password = hashedNewPassword;
    await user.save();

    sendToken(user, 200, res)
  } catch (error) {
    console.error(error);
    return next(new ErrorHandler(`Internal server error ${error}`, 500));
  }
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


// ADMIN ROUTES IN THE APPLICATION

//Get all users => /api/v1/admin/users
const getAllUsers = catchAsyncErrors(async(req, res, next) => {
  // first we run a query for mongoDB database for finding all users
  const users = await User.find();
// to count the number of users on the database and return it
  const numberOfUsers = await User.countDocuments();
  //return users .in json format
  res.status(200).json({
    message: "All users successfully found",
    users,
    userCount: numberOfUsers
  })
})

//Get all users => /api/v1/admin/getProfile
const getUserProfileDetails = catchAsyncErrors(async(req, res, next) => {
  // introduce try catch block for efficient error  handling
  try {
    //extract the user id from the params
    const userId = req.params.userId;
    const user = await User.findById(userId);
    //validation to make sure that a user is found
    if(!user){
      return next(new ErrorHandler(`User with ID ${userId} does not exist on database`))
    }    
    // return the result in json
    res.status(200).json({
      message: "User Profile successfully found",
      user
    })
  } catch (error) {
    console.error(error);
    return next(new ErrorHandler("User profile not successfully found", 500))
  }
});

//Get all users => /api/v1/admin/deleteUser
const deleteUser = catchAsyncErrors(async(req, res, next) => {
  // get the user throught the ID
  const userId = await req.params.id;
  const user = await User.findById(userId);
  //basic validation
  if(!user){
    return next(new ErrorHandler(`User with ID ${userId} not found on the database`))
  }
  // delete documents from the database
  await User.remove();
 
  res.status(200).json({
    message: "user successfuully deleted from database",
    user,
  });

})

// Remember to test all API endpoints today

module.exports = {
  createNewUser,
  loginUser,
  getUserProfile,
  updatePassword,
  updateProfile,
  getAllUsers,
  getUserProfileDetails,
  logoutUser,
  deleteUser
}