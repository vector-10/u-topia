const Transaction = require('../models/transactionModel');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const User = require('../models/authModels');
const Wallet = require('../models/walletModel');

// the logic for the initiating peerloan transfers
const peerLoanTransfer = catchAsyncErrors(async(req, res, next) => {
    const senderId = req.params.senderId;
    // set the requied parameters for a loan transfer to occur
    const { amount, pin, description, receiverAccountNumber } = req.body;

    try {
        // now to verify the sender and receiver
        const sender = await User.findById(senderId);
        const receiverWallet = await Wallet.findOne({ accountNumber : receiverAccountNumber });
         // validation just incase either of them does not exist
        if(!sender || !receiverWallet) {
            return next(ErrorHandler("Invalid sender or receiver credentials", 400 ))
        }
        //  Ensure that the sender has enough money for the transfer
        const senderWallet = await Wallet.findOne({ user: senderId });
        // validation if amount if more than senders balance and throw error
        if(!senderWallet || senderWallet.balance < amount ) {
            return next(new ErrorHandler("Insufficient funds in senders wallet", 400))
        }
        // validate pin to ensure its accurate
        if (!senderWallet || !senderWallet.transferPin || pin !== senderWallet.transferPin.toString()) {
            return next(new ErrorHandler("Invalid pin entered", 400))
        }
        

        // update sender and receivers balance
        const updatedSendersBalance = senderWallet.balance - amount;
        const updateReceiversBalance = receiverWallet.balance + amount;

        await Wallet.updateOne({ user: senderId }, { balance: updatedSendersBalance });
        await Wallet.updateOne({ accountNumber: receiverAccountNumber }, { balance: updateReceiversBalance });

        //Record the transaction
        await Transaction.create({
            sender: senderId,
            receiver: receiverWallet.user,
            amount,
            description
        })
        // return successful transaction response
        res.status(200).json({
            message: "Loan transfer successful"
        })
    } catch (error) {
        console.log(error);
        return next(new ErrorHandler("Funds transfer failed", error, 500))
    }
    
})

module.exports = { peerLoanTransfer };