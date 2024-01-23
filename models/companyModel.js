const mongoose = require('mongoose');
const validator = require('validator');

const companySchema = new mongoose.Schema({
    companyName:{
        type: String,
        required: [true, "Please provide a ccompany name"],
        minlength: [5, "COmpany name should be more than 5 characters"],
        maxlength: [30, "Company name cannot exceeed 30 characters"]
    },
    contactNumber: {
        type: Number,
        required:  [true,"please provide a contact phone number"]
    },
    contactEmail:{
        type: String,
        required:  [true,"Please provide a valid email address"],
        unique: [true, "Please provide a unique email address"],
        validate: [validator.isEmail, "Please provide a valid email"]
    },
    representativeName:{
        type: String,
        required: [true, "Please provide a company representative"],        
    },
    industry: {
        type: String,
        required: [true, "Please provide an industry category"],
        enum: ['technology', 'health', 'finance', 'science', 'arts']
      },
      companyDescription: {
        type: String,
        required: [true, "Please provide a company description"]
      },
      websiteURL: {
        type: String,
      },
      companyAddress: {
        type: String,
        required: [true, "Please provide a company address"]
      }
})

module.exports = mongoose.model('Company', companySchema);