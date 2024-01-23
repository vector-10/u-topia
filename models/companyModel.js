const mongoose = require('mongoose');
const validator = require('validator');

const companySchema = new mongoose.Schema({
    companyName:{
        type: String,
        required: [true, "Please provide a ccompany name"],
        minlength: [5, "COmpany name should be more than 5 characters"],
        maxlength: [30, "Company name cannot exceeed 30 characters"]
    },
    contact: {
        type: Number,
        required:  [true,"please provide a contact phone nu`mber"]
    },
    contactEmail:{
        type: String,
        required:  [true,"Please provide a valid email address"],
        unique: [true, "Please provide a unique email address"],
        validate: [validator.isEmail, "Please provide a valid email"]
    },
    industry: {
        type: String,
        required: true,
      },
      companyDescription: {
        type: String,
        required: true,
      },
      websiteURL: {
        type: String,
      },
      companyAddress: {
        type: String,
      },
      


})

module.exports = mongoose.model('Company', companySchema);