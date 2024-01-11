 const mongoose = require("mongoose");

    const connectDB = () => {
      mongoose.connect()
        .then((result) => {
          console.log(
            `MongoDB database connected with HOST: ${result.connection.host}`
          );
        });
    };
  
  module.exports = connectDB;