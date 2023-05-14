const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.post('/', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if the username or email already exists in the database
    const existingUser = await User.findOne().or([{ username }, { email }]);
    if (existingUser) {
      return res.status(409).json({ error: 'Username or email already exists' });
    }

    // Create a new user object
    const newUser = new User({
      username,
      email,
      password,
    });

    // Save the new user to the database
    const savedUser = await newUser.save();

    res.status(201).json(savedUser);
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'An error occurred while registering user' });
  }
});

module.exports = router;
