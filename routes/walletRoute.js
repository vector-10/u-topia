const express = require('express');
const router = express.Router();
const { getWalletBalance, updateWalletBalance, createWallet  } = require('../controllers/walletController');

// routes for creating a wallet
router.route("/user/create-wallet/:userId").post(createWallet);
router.route("/user/update-wallet").get(updateWalletBalance);
router.route("/user/wallet-balance").post(getWalletBalance);





module.exports = router;