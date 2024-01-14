const express = require('express');
const router = express.Router();
const { createNewUser } = require('../controllers/authController');
   
//Define routes and methods
router.route('/create-user').post(createNewUser);
   


 module.exports = router;