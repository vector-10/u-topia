// this is a utility file created to generate random account numbers, it makes use of the math.random.
const User = require('../models/authModels');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');

const assignAccountNumber = catchAsyncErrors(async(req, res, next) => {
    //define account number, set unique as a false boolean until checked in database
    let accountNumber;
    let isUnique = false;

    while(!isUnique) {
        accountNumber = generateAccountNumber();
    }

    try {
        //check to see if account number already exists in DB
        const existingAccount = await User.findOne({ accountNumber });

        if(!existingAccount) 
            isUnique = true;
   
    } catch (error) {
        console.log(error);
        return next( new ErrorHandler ("Account Number already exists, please try again", 500))
    }
    return accountNumber;
})


module.exports = { assignAccountNumber };
