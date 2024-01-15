const express = require('express');
const router = express.Router();
const { createNewUser, loginUser, logoutUser, getUserProfile, updateProfile, updatePassword } = require('../controllers/authController');
   
//Define routes and methods
router.route('/create-user').post(createNewUser);
router.route('/login-user').post(loginUser);
router.route('/logout-user').get(logoutUser);
router.route('/getuser-profile/:userId').get(getUserProfile);
router.route('/update-profile/:userId').put(updateProfile);
router.route('/update-password/:userId').put(updatePassword)
   


 module.exports = router;