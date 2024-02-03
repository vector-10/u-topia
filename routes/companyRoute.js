const express = require('express');
const router = express.Router();
const { createCompany, getCompanyProfile, updateCompanyProfile, createJob, getAllJobsbyCompany, updateJob, deleteJob} = require('../controllers/companyController');

// company CRUD routes
router.route('/company/createcompany').post(createCompany);
router.route('/company/profile/:companyId').get(getCompanyProfile);
router.route('/company/updateprofile/:companyId').put(updateCompanyProfile);



module.exports = router;