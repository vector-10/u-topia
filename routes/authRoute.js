const express = require('express');
const router = express.Router();
const { authController } = require('../controllers/authController');
   
//Define routes and methods
router.route('/create-user').post(authController)
   


 module.exports = router;