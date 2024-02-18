const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

// create schema for user object
const authSchema = new mongoose.Schema({
    // Personal Information
      name: {
        type: String,
        required: [true, "Please provide a FirstName to create an account"],
        minlength: 3,
        maxlength: [40, "Your FirstName should not exceed 20 characters"],
      },
      dateOfBirth: {
        type: Date,
        required: [true, "Please provide an date of birth to create an account"],
      },
      gender: {
        type: String,
        required: [true, "Please provide a gender to create an account"],
        enum: ["Male", "Female"],
      },
      nationality: {
        type: String,
        required: [true, "Please provide a nationality to create an account"],
      }, 
      salutation: {
        type: String,
        required: [true, "Please provide a salutation to create an account"],
        enum: ["Mr", "Mrs", "Master", "Miss"],
      },
      // Contact Information
      address: {
        type: String,
        required: [true, "Please provide an address to create an account"],
      },
      email: {
        type: String,
        required: [true, "Please provide an email to create an account"],
        unique: true,
        validate: [validator.isEmail, "Please enter a valid email"],
      },
      mobileNumber: {
        type: String,
        required: [true, "Please provide a preferred number to open an account"],
      },
      //Security Information
      password: {
        type: String,
        required: [true, "Please provide your password to create an account"],
      },
      confirmPassword: {
        type: String,
      },
      bvn: {
        type: Number,
        required: [true, "Please provide a BVN for verification"],
        // unique: true,
      },
      role: {
        type: String,
        required:[true, "Please select a role on the platform"],
        enum: ["company", "user", "admin"]
      },
      // Extra Security
      maritalStatus: {
        type: String,
        required: [
          true,
          "Please provide mother's maiden name to create an account",
        ],
        enum: ["married", "single"],
      },
      occupation: {
        type: String,
        required: [true, "Please provide an occupation to create an account"],
      },
      employmentStatus: {
        type: String,
        required: [true, "Please select an employment status to create an account"],
        enum: ["employed", "unemployed", "self-employed"]
      },
      sourceofIncome:{
        type: String,
        required: [true, "Please provide a valid source of income"]
      },
      city: {
        type: String,
        required: [true, "Please provide a city name to create an account"],
      },
      state: {
        type: String,
        required: [true, "Please provide a state to create an account"],
      },
      wallet: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Wallet',
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
});

// to hash the user password before it is verified the database

authSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }

    this.password = await bcrypt.hash(this.password, 10);

    if (this.isModified("transferPin")) {
        this.transferPin = await bcrypt.hash(this.transferPin.toString(), 10);
    }

    return next();
});

authSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}

authSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  userObject.dateOfBirth = this.dateOfBirth.toISOString();
  return userObject;
}

// To calculate credit score based on user balance 


// export authentication schema in the name of User
module.exports = mongoose.model('User', authSchema);