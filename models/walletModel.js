const mongoose = require('mongoose');

const wallletSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
    },
    balance: {
        type: Number,
        default: 100000,
        min: 0,
    },
    transactions: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Transaction',
        },
    ],
});

module.exports = mongoose.model("Wallet", wallletSchema);

