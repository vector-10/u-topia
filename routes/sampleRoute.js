const express = require('express');
   const router = express.Router();
   const { sampleController } = require('../controllers/sampleController');
   
   //Define routes
   router.route('/sample').get(sampleController.getSampleData).post().put().delete()
   
   module.exports = router;