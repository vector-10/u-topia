const mongoose = require('mongoose');
const User = require('../models/authModels');

const generateAccountNumber = () => {
  const min = 1000000000;
  const max = 9999999999;
  return (Math.floor(Math.random() * (max - min + 1)) + min).toString();
};

const walletSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    unique: true,
  },
  balance: {
    type: Number,
    default: 100000,
  },
  accountNumber: {
    type: String,
    unique: true,
    // Use a function to generate the default value
    default: generateAccountNumber,
  },
});

// Pre-save hook to generate a unique account number if not already set
walletSchema.pre('save', async function (next) {
  if (!this.accountNumber) {
    this.accountNumber = generateAccountNumber();
  }
  next();
});

module.exports = mongoose.model('Wallet', walletSchema);
