// POST /api/admin/signin
const express = require('express');
const router = express.Router();
const AdminSignInSchema = require('./adminSignUpSchema'); // import your Mongoose model
const bcrypt = require('bcryptjs');

router.post('/signin', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    const admin = await AdminSignInSchema.findOne({ username });
    
    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Create a simplified admin object without password
    const adminData = {
      id: admin._id,
      username: admin.username,
      email: admin.email,
      createdAt: admin.createdAt
    };

    res.status(200).json({ 
      message: 'Login successful',
      admin: adminData
    });

  } catch (err) {
    console.error('Signin error:', err);
    res.status(500).json({ 
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});
  
  module.exports = router;