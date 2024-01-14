const User = require("../models/authModels");

const generateAccountNumber = () => {
  const min = 1000000000;
  const max = 9999999999;

  return (Math.floor(Math.random() * (max - min + 1)) + min).toString();
};

const assignAccountNumber = async (user) => {
  let accountNumber;
  let isUnique = false;

  while (!isUnique) {
    accountNumber = generateAccountNumber();

    const existingAccount = await User.findOne({ accountNumber });

    if (!existingAccount) {
      isUnique = true;
    }
  }

  return accountNumber;
};

module.exports = assignAccountNumber;