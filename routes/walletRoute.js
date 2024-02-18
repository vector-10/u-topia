const express = require('express');
const router = express.Router();
const { getWalletBalance, createWallet  } = require('../controllers/walletController');

// routes for creating a wallet
router.route("/user/create-wallet/:userId").post(createWallet);
// router.route("/user/update-wallet").get(updateWalletBalance);
router.route("/user/wallet-balance/:userId").get(getWalletBalance);





module.exports = router;