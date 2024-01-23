const Company = require('../models/companyModel');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const ErrorHandler = require('../utils/errorHandler');

const createCompany = catchAsyncerrors(async(req, res, next) => {
    // first we have to set the properties for creating companies
    const { companyName, contactNumber, contactEmail, representativeName, industry,
           companyDescription, websiteURL, companyAddress} = req.body;
    // check to ensure unique emails are provided only
    const checkIfContactEmailExists = await Company.findOne({ contactEmail });
    if(checkIfContactEmailExists) {
        return next(new ErrorHandler ("Please ensure that contact email provided is unique", 401))
    }
    // now to create the company using database methods
    try {
        const company = await Company.create({
            companyName, contactNumber, contactEmail, representativeName,
             industry, companyDescription, websiteURL, companyAddress
        })
        //return company in json
        res.status(201).json({
            message: "success",
            company
        })
    } catch (error) {
        console.log(error)
        return next(new ErrorHandler("Error creating new company", 500))
    }
})

const getCompanyProfile = (async(req, res, next) => {
    try {
        // set the company ID for database usage
    const companyId = req.params.companyId;
    const company = await User.findById(companyId);
    // basic validation to find company
    if(!company){
        return next(new ErrorHandler(`Company with ID ${companyId} does not exist on database`))
      }
      // return company in json
    res.status(200).json({
        message: "Company Profile found",
        company  
    })
    } catch (error) {
        console.log(error);
        return next(new ErrorHandler("Company profile not found", 404))
    }
})

const updateCompanyProfile = async(catchAsyncErrors(req, res, next) => {

})

const createJob = async(catchAsyncErrors(req, res, next) => {

})

const updateJob = async(catchAsyncErrors(req, res, next) => {

})

const deleteJob = async(catchAsyncErrors(req, res, next) => {

})











module.exports = {createCompany, getCompanyProfile, updateCompanyProfile, createJob, updateJob, deleteJob}