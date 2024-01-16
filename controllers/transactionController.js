const Transaction = require('../models/transactionModel');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const User = require('../models/authModels');
const Wallet = require('../models/walletModel');

// this will control logic for the performing of transactions on the app
const PeerLoanTransfer = catchAsyncErrors(async(req, res, next) => {
    //set the proper information from the user to the requestbody
    const { senderId, receiverAccountNumber, amount, pin } = req.body;

   try {
    // name the variable sender by and set it to id of sender
    const sender = await User.findById(senderId);
    const receiver = await User.findOne({ accountNumber: receiverAccountNumber });    
    // a little validation to ensure that sender and receiver are correct
    if(!sender || !receiver) {
        return next(new ErrorHandler("Invalid sender or receiver credentials", 400))
    }
    // to check if the sender has funds in the wallet currently
    const senderWallet = await Wallet.findOne({ user: senderId });
    //extra check
    if(!senderWallet || senderWallet.accountBalance < amount) {
        return next(new ErrorHandler("Account Balance is Insufficient", 400))
    }
    // to validate pin
    if ( pin !== senderWallet.transferPin.toString()) {
        return next(new ErrorHandler("Invalid pin number", 400))
    }

    //Update sender and receivers wallet balance to symbolize transfer
    const updatedSenderBalance = senderWallet.accountBalance - amount;
    const updatedReceiverBalance = (await Wallet.findOne({ user: receiver._id })).accountBalance + amount;

    await Wallet.findOneAndUpdate({ user: senderId }, { accountBalance: updatedSenderBalance });
    await wallet.findOneAndUpdate({ user: receiver._id }, { accountBalance: updateReceiverbalance });

    // record the transaction
    await Transaction.create({
        sender: senderId,
        receiver: receiver._id,
        amount,
        description: req.body.description || 'Peer to Peer loan transfer',
    });
    // return success response in json    
    res.status(200).json({ message: 'Funds transfer successful'});
   } catch (error) {
    return next(new ErrorHandler('Funds transfer failed', 500));
   }
})

modules.exports= { PeerLoanTransfer };