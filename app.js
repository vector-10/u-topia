require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const userAuthRoute = require('./routes/authRoute');
const companyRoute = require('./routes/companyRoute');
const jobRoute = require('./routes/jobRoute');
const walletRoute = require('./routes/walletRoute');
const connectDB = require('./database/connect');


// Middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));


// Testing Routes
  app.get('/', (req, res) => {
    res.json({
      message: "Hello from Server"
    })
  });


// Routes auth, company, wallet, job
app.use('/api/v1', userAuthRoute);
app.use('/api/v1', companyRoute);
app.use('/api/v1', walletRoute);
app.use('/api/v1', jobRoute);



// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
  });
});


// start the server process
const PORT = process.env.PORT || 5000;
// To initialise connectDB function
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