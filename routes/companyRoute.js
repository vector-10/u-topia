const express = require('express');
const router = express.Router();
const { createCompany, getCompanyProfile, updateCompanyProfile, createJob, getAllJobsbyCompany, updateJob, deleteJob} = require('../controllers/companyController');

// company CRUD routes
router.route('/company/createcompany').post(createCompany);
router.route('/company/profile/:companyId').get(getCompanyProfile);
router.route('/company/updateprofile/:companyId').put(updateCompanyProfile);
router.route('company/createjob').post(createJob);
router.route('/company/getjobs').get(getAllJobsbyCompany);
router.route('/company/updatejob/:jobId').put(updateJob);
router.route('/company/deletejob/:jobId').delete(deleteJob);


module.exports = router;