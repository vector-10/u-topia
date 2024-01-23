const express = require('express');
const router = express.Router();
const { createCompany, getCompanyProfile, updateCompanyProfile, createJob, getAllJobs, updateJob, deleteJob} = require('../controllers/companyController');

router.route('/company/createcompany').post(createCompany);
router.route('/company/getprofile').get(getCompanyProfile);
router.route('/company/updateprofile').put(updateCompanyProfile);
router.route('company/createjob').post(createJob);
router.route('/company/getjobs').get(getAllJobs);
router.route('/company/updatejob/:Id').put(updateJob);
router.route('/company/deletejob').delete(deleteJob);


module.exports = router;