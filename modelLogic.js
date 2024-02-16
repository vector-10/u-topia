// const mongoose = require('mongoose');
// const User = require('../models/authModels');

// const generateAccountNumber = () => {
//   const min = 1000000000;
//   const max = 9999999999;
//   return (Math.floor(Math.random() * (max - min + 1)) + min).toString();
// };

// const walletSchema = new mongoose.Schema({
//   user: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     unique: true,
//   },
//   balance: {
//     type: Number,
//     default: 100000,
//   },
//   accountNumber: {
//     type: String,
//     unique: true,
//     // Use a function to generate the default value
//     default: function () {
//       return this.generateUniqueAccountNumber();
//     },
//   },
// });

// // Pre-save hook to generate a unique account number
// walletSchema.pre('save', async function (next) {
//   if (!this.accountNumber) {
//     this.accountNumber = await this.generateUniqueAccountNumber();
//   }
//   next();
// });

// // Instance method to generate a unique account number
// walletSchema.methods.generateUniqueAccountNumber = async function () {
//   let accountNumber;
//   let isUnique = false;

//   while (!isUnique) {
//     accountNumber = generateAccountNumber();

//     // Check if the account number already exists in the User collection
//     const existingAccount = await User.findOne({ accountNumber });

//     if (!existingAccount) {
//       isUnique = true;
//     }
//   }

//   return accountNumber;
// };

// module.exports = mongoose.model('Wallet', walletSchema);
