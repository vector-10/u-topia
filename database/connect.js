const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_LOCAL_URI);
    console.log(`MongoDB database connected with HOST ${mongoose.connection.host}`);
  } catch (error) {
   console.log(`MongoDB database not connected ${error}`);
  }
}

module.exports = connectDB;



