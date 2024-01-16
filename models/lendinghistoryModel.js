const mongoose = require('mongoose');

const lendingHistorySchema = new mongoose.Schema({
  lender: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
},
  borrower: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
},
  amount: { 
    type: Number, 
    required: true 
},
  date: { 
    type: Date, 
    default: Date.now 
},
});

module.exports = mongoose.model('LendingHistory', lendingHistorySchema);
