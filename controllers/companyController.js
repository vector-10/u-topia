// contains logic for the company and job controllers
const Company = require('../models/companyModel');
const Job = require('../models/jobModel');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const ErrorHandler = require('../utils/errorHandler');

const createCompany = catchAsyncErrors(async(req, res, next) => {
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
        //return created company in json
        res.status(201).json({
            message: "success",
            company
        })
    } catch (error) {
        console.log(error)
        return next(new ErrorHandler("Error creating new company", 500))
    }
})

const getCompanyProfile = catchAsyncErrors(async(req, res, next) => {
    try {
        // set the company ID for database usage
    const companyId = req.params.companyId;
    const company = await Company.findById(companyId);
    // basic validation to find company
    if(!company){
        return next(new ErrorHandler(`Company with ID ${companyId} does not exist on database`, 401))
      }
      // return company profile in json
    res.status(200).json({
        message: "Company Profile found",
        company  
    })
    } catch (error) {
        console.log(error);
        return next(new ErrorHandler("Company profile not found", 404))
    }
})

const updateCompanyProfile = catchAsyncErrors(async(req, res, next) => {
   try {
     // first we find the company profile that we want to update
     const companyId = req.params.companyId;
     const company = await Company.findById(companyId);
     // simple validation
     if(!company) {
         return next(new ErrorHandler(`Company with ID ${companyId} not found on database`, 401))
     }
     // update user profile based on the fields youwant to change
     company.companyName = req.body.companyName || company.companyName
     company.contactNumber = req.body.contactNumber || company.contactNumber
     company.contactEmail = req.body.contactEmail || company.contactEmail
     company.representativeName = req.body.representativeName || company.representativeName
     company.industry = req.body.industry || company.industry
     company.companyDescription = req.body.companyDescription || company.companyDescription
     company.websiteURL = req.body.websiteURL || company.websiteURL
     company.companyAddress = req.body.companyAddress || company.companyAddress
 
     // save the updated company profile
     await company.save();
     // return updated parameters
     res.status(200).json({
        message: "Company profile successfully updated",
        companyprofile:{
         _id: company._id,
         companyName: company.companyName,
         contactNumber: company.contactNumber,
         contactEmail: company.contactEmail,
         representativeName: company.representativeName,
         industry: company.industry,
         companyDescription: company.companyDescription,
         websiteURL: company.websiteURL,
         companyAddress: company.companyAddress
        }
     })
 
   } catch (error) {
    console.log(error);
    return next(new ErrorHandler("Error updating company profile", 500));
   }
});

const createJob = catchAsyncErrors(async(req, res, next) => {
    try {
            // set properties for creating a job to erquest body
    const { title, description, qualifications, duration, company} = req.body;
    const job = await Job.create({
        title,
        description,
        qualifications,
        duration,
        company
    });
    res.status(200).json({
        message: "Job successfully created",
        job
    })       
    } catch (error) {
        console.log(error);

    }   
})

const getAllJobsbyCompany = catchAsyncErrors(async(req, res, next) => {
    //get the company ID from companyID
    const companyId = req.params.companyId;

    //fetch jobs created by specific company from the database
    const companyJobs = await company.findById({ companyId: companyId })

    // return the jobs specific to a company
    res.status(200).json({
        message: "Jobs created by company found",
        companyJobs
    })
})

const updateJob = catchAsyncErrors(async(req, res, next) => {
    try {
        // first we find the company profile that we want to update
        const jobId = req.params.jobId;
        const job = await Job.findById(jobId);
        // simple validation
        if(!job) {
            return next(new ErrorHandler(`Job with ID ${jobId} not found on database`, 401))
        }
        // update user profile based on the fields youwant to change
        job.title = req.body.title || job.title
        job.description = req.body.description || job.description
        job.qualifications = req.body.qualifications || job.qualifications
        job.duration = req.body.duration || job.duration
       
        // save the updated company profile
        await job.save();
        // return updated parameters
        res.status(200).json({
           message: "Company profile successfully updated",
           updatedJob:{
            _id: job._id,
            title: job.title,
            description: job.description,
            qualifications: job.qualifications,
            duration: job.duration            
           }
        });    
      } catch (error) {
       console.log(error);
       return next(new ErrorHandler("Error updating job details", 500));
      }


})

const deleteJob = catchAsyncErrors(async(req, res, next) => {
    try {
        // find the job by id
    const jobId = req.params.jobId;
    const job = await Job.findById(jobId);
    // simple validation for finding job
    if(!job) {
        return next(new ErrorHandler(`Job with ID ${jobId} not found in database`, 401))
    }
    // delete job from database
    await job.remove();
    } catch (error) {
        console.log(error);
        return next(new ErrorHandler(`Job with ID ${jobId} was not deleted`, 500))       
    }
})


module.exports = 
{    createCompany,
     getCompanyProfile,
     updateCompanyProfile,
     createJob,
     getAllJobsbyCompany,
     updateJob,
    deleteJob
    }