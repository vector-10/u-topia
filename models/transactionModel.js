const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    wallet: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Wallet',
      },
    sender: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User'
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    amount: {
        type: Number,
        required: [true, "Please provide and an amount"]
    },
    description:{
        type: String,
        retuired: [true, "Please provide a Loan description"]
    },
    date: {
        type: Date,
        default: Date.now
    }

})

module.exports = mongoose.model('Transaction', transactionSchema);