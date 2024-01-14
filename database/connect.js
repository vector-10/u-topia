const mongoose = require("mongoose");

const connectDB = () => {
  mongoose
    .connect(process.env.DB_LOCAL_URI)
    .then((result) => {
      console.log(
        `MongoDB database connected with HOST: ${result.connection.host}`
      );
    });
};

module.exports = connectDB;