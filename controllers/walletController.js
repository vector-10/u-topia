const Wallet = require('../models/walletModel');
const User = require('../models/authModels');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');


const createWallet = catchAsyncErrors(async (req, res, next) => {
    try {
        // to get the user ID from the authentication
        const userId = req.params.userId;
        //ensure that only users can create wallets
        const existingUser = await User.findById(userId);
        //simple check to continue
        if(!existingUser){
            return next(new ErrorHandler("User does not exist in the database", 401));
        }
        // check if user has an existing wallet
        const existingWallet = await Wallet.findOne({ user: userId })
        if(existingWallet) {
            return next(new ErrorHandler("User already has a wallet in the database", 403));
        }
        const newWallet = new Wallet({ user: userId });

        //save the wallet to the database
        await newWallet.save();
        // return wallet in json
        res.status(201).json({
         message: 'Wallet created successfully',
         wallet: {
          user: newWallet.user,
          balance: newWallet.balance,
          accountNumber: newWallet.accountNumber
         }
        });
    } catch (error) {
        console.error('Error creating wallet:', error.message);
        return next (new ErrorHandler("User wallet not created successfully"));        
    }

})

// Get Wallet Balance
const getWalletBalance = catchAsyncErrors(async (req, res, next) => {
  const userId = req.params.userId;

  try {
    const wallet = await Wallet.findOne({ user: userId });

    if (!wallet) {
      return next(new ErrorHandler('Wallet not found', 404));
    }

    res.status(200).json({ balance: wallet.accountBalance });
  } catch (error) {
    return next(new ErrorHandler('Error getting wallet balance', 500));
  }
});


// Update Wallet Balance
const updateWalletBalance = catchAsyncErrors(async (userId, amount) => {
  try {
    const wallet = await Wallet.findOne({ user: userId });

    if (!wallet) {
      throw new ErrorHandler('Wallet not found', 404);
    }

    wallet.accountBalance += amount;
    await wallet.save();
  } catch (error) {
    throw new ErrorHandler('Error updating wallet balance', 500);
  }
});

// Other wallet-related functions...

module.exports = { getWalletBalance, updateWalletBalance, createWallet  };
