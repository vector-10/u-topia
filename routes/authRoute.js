const express = require('express');
const router = express.Router();
const { createNewUser, loginUser } = require('../controllers/authController');
   
//Define routes and methods
router.route('/create-user').post(createNewUser);
router.route('/login-user').post(loginUser);
   


 module.exports = router;