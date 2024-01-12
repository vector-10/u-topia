 const mongoose = require("mongoose");

 //asynchronous function to conncet to DB
    const connectDB = async (url) => {
      mongoose.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
        .then((result) => {
          console.log(
            `MongoDB database connected with HOST: ${result.connection.host}`
          );
        });
    };
  
  module.exports = connectDB;