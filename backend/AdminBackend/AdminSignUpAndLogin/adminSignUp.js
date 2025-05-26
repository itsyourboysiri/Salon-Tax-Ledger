const express = require('express');
const router = express.Router();
const AdminSignUnSchema = require('./adminSignUpSchema'); // import your Mongoose model
const bcrypt = require('bcryptjs');
const saltRounds = 10;


router.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingAdmin = await AdminSignUnSchema.findOne({ $or: [{ username }, { email }] });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Make sure to use the correct model name (AdminSignUnSchema)
    const newAdmin = new AdminSignUnSchema({ 
      username, 
      email, 
      password: hashedPassword 
    });
    
    await newAdmin.save();

    res.status(201).json({ message: 'Admin registered successfully' });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
});

module.exports = router;
