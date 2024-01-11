const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const sampleDataRoute = require('./routes/sampleRoute');

// Middleware
app.use(bodyParser.json());

// Routes
app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.get('/api/v1', sampleDataRoute);


// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
  