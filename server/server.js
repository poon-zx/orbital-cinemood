const express = require('express');
const app = express();
const port = 3000; // Specify the port you want to run your server on

// Middleware
app.use(express.json()); // Parse JSON request bodies

// Login Routes
const loginRoutes = require('./server/routes/login');
app.use('/api', loginRoutes);

const mongoose = require('mongoose');


mongoose.connect('mongodb://localhost:27017/cinemood.users', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(port, () => {
      console.log('Server is running on port 3000');
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });