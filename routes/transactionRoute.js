const express = require('express');
const router = express.Router();

const { peerLoanTransfer } = require('../controllers/transactionController');

router.route('/user/peer-loan/:senderId').post(peerLoanTransfer);








module.exports = router;