// const Wallet = require('../models/Wallet');
// const ErrorHandler = require('../utils/errorHandler');
// const catchAsyncErrors = require('../middleware/catchAsyncErrors');

// // Get Wallet Balance
// const getWalletBalance = catchAsyncErrors(async (req, res, next) => {
//   const userId = req.params.userId;

//   try {
//     const wallet = await Wallet.findOne({ user: userId });

//     if (!wallet) {
//       return next(new ErrorHandler('Wallet not found', 404));
//     }

//     res.status(200).json({ balance: wallet.accountBalance });
//   } catch (error) {
//     return next(new ErrorHandler('Error getting wallet balance', 500));
//   }
// });

// // Update Wallet Balance
// const updateWalletBalance = catchAsyncErrors(async (userId, amount) => {
//   try {
//     const wallet = await Wallet.findOne({ user: userId });

//     if (!wallet) {
//       throw new ErrorHandler('Wallet not found', 404);
//     }

//     wallet.accountBalance += amount;
//     await wallet.save();
//   } catch (error) {
//     throw new ErrorHandler('Error updating wallet balance', 500);
//   }
// });

// // Other wallet-related functions...

// module.exports = { getWalletBalance, updateWalletBalance /*, other functions...*/ };
