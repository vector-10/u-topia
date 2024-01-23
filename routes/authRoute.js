const express = require('express');
const router = express.Router();
const { createNewUser, loginUser, logoutUser, getUserProfile, updateProfile, updatePassword, getAllUsers, getUserProfileDetails,deleteUser  } = require('../controllers/authController');
const { deleteCompany } = require('../controllers/authController');
const { authenticatedUser, authorizeRoles } = require('../middleware/authMiddleware');
   
//Define routes and methods
router.route('/create-user').post(createNewUser);
router.route('/login-user').post(loginUser);
router.route('/logout-user').get(logoutUser);
router.route('/getuser-profile/:userId').get(getUserProfile);
router.route('/update-profile/:userId').put(updateProfile);
router.route('/update-password/:userId').put(updatePassword);

//Admin Routes
router.route('/admin/get-users').get(getAllUsers);
router.route('/admin/get-profile/:userId').get(getUserProfileDetails);
router.route('/admin/delete-user/:userId').get(deleteUser);
router.route('/admin/delete-company/company:Id').get(deleteCompany);
   

 module.exports = router;