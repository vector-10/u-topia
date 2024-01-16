require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const userAuth = require('./routes/authRoute');
const connectDB = require('./database/connect');

// Middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));


//Routes
  app.get('/', (req, res) => {
    res.json({
      message: "Hello from Server"
    })
  });
// Routes auth, 
app.use('/api/v1', userAuth);


// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
  });
});


// start the server process
const PORT = process.env.PORT || 5000;
// TO connect DB
connectDB();
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


//Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.log(`ERROR: ${err.stack}`);
  console.log(`Shutting down due to uncaught exception`);
  process.exit(1);
});
  

//Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.log(`ERROR: ${err.message}`);
  console.log("Shutting down the server due to unhandled Promise rejection");
  server.close(() => {
    process.exit(1);
  });
});