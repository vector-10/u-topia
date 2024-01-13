const mongoose = require("mongoose");

const connectDB = (DB_LOCAL_URI) => {
  mongoose
    .connect(process.env.DB_LOCAL_URI, {
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