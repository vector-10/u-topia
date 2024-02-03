const express = require('express');
const router = express.Router();
const { createJob, getAllJobsbyCompany, updateJob, deleteJob} = require('../controllers/companyController');

router.route('/company/createjob').post(createJob);
router.route('/company/getjobs/:companyId').get(getAllJobsbyCompany);
router.route('/company/updatejob/:jobId').put(updateJob);
router.route('/company/deletejob/:jobId').delete(deleteJob);

module.exports = router;