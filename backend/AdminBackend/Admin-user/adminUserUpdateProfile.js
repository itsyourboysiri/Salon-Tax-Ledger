const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const fs = require('fs');
const Admin = require('../AdminSignUpAndLogin/adminSignUpSchema'); // Assuming you have an Admin model

// Ensure uploads directory exists
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

router.get('/profile/:username', async (req, res) => {
  try {
    const { username } = req.params;
    
    if (!username) {
      return res.status(400).json({ message: 'Username is required' });
    }

    const admin = await Admin.findOne({ username }).select('-password');
    
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    res.json({
      username: admin.username,
      email: admin.email,
      profilePicture: admin.profilePicture || null
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Error fetching profile' });
  }
});

router.put('/update-profile', upload.single('profilePicture'), async (req, res) => {
  try {
    const { username, email, currentUsername } = req.body;
    
    if (!username || !email || !currentUsername) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const admin = await Admin.findOne({ username: currentUsername });
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    // Check username availability
    if (username !== currentUsername) {
      const existingUser = await Admin.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ message: 'Username already taken' });
      }
    }

    // Check email availability
    if (email !== admin.email) {
      const existingEmail = await Admin.findOne({ email });
      if (existingEmail) {
        return res.status(400).json({ message: 'Email already in use' });
      }
    }

    // Update fields
    admin.username = username;
    admin.email = email;

    // Handle profile picture update
    if (req.file) {
      // Delete old profile picture if it exists
      if (admin.profilePicture) {
        const oldFilename = admin.profilePicture.split('/').pop();
        try {
          fs.unlinkSync(path.join(uploadDir, oldFilename));
        } catch (err) {
          console.error('Error deleting old profile picture:', err);
        }
      }
      // Set new profile picture URL
      admin.profilePicture = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    }

    await admin.save();

    res.json({
      message: 'Profile updated successfully',
      username: admin.username,
      email: admin.email,
      profilePicture: admin.profilePicture
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Error updating profile' });
  }
});

module.exports = router;