const express = require("express");
const User = require("./usermodel");
const bcrypt = require("bcryptjs");
const multer = require('multer');
const path = require('path');

const router = express.Router();

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, './public/useruploads'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Helper functions for validation
const validatePhoneNumber = (phone) => /^0[1-9]\d{8}$/.test(phone);
const validatePassword = (password) => password.length > 5 && /[!@#$%^&*(),.?":{}|<>]/.test(password);
const validateNIC = (nic) => /^[0-9]{9}[VXvx]$|^[0-9]{12}$/.test(nic);
const validateTIN = (tinno) => /^[0-9]+$/.test(tinno);
const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// Register user
router.post("/", upload.single('profileImage'), async (req, res) => {
  try {
    // Extract fields from form-data
    const {
      name,
      dob,
      address,
      phone,
      salonName,
      salonAddress,
      username,
      password,
      confirmPassword,
      stories,
      area,
      nic,
      tinno,
      email
    } = req.body;

    // Server-side validation
    if (!name || !dob || !address || !phone || !salonName || !salonAddress || 
        !username || !password || !confirmPassword || !stories || !area || 
        !nic || !tinno || !email) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!validatePhoneNumber(phone)) {
      return res.status(400).json({ message: "Invalid Sri Lankan phone number (e.g., 0712345678)" });
    }

    if (!validatePassword(password)) {
      return res.status(400).json({ message: "Password must be at least 6 characters long and contain at least one special character" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    if (!validateNIC(nic)) {
      return res.status(400).json({ message: "Invalid NIC format (e.g., 123456789V or 200012345678)" });
    }

    if (!validateTIN(tinno)) {
      return res.status(400).json({ message: "TIN number should only contain numbers" });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Parse area if it's a string
    let areaArray;
    try {
      areaArray = Array.isArray(area) ? area : JSON.parse(area);
    } catch (e) {
      areaArray = [Number(area)];
    }
    areaArray = [].concat(areaArray);

    if (areaArray.some(a => isNaN(a) || a <= 0)) {
      return res.status(400).json({ message: "Salon area must be positive numbers" });
    }

    // Check if username or email already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: "Username or email already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user object
    const userData = {
      name,
      dob,
      address,
      phone,
      salonName,
      salonAddress,
      username,
      password: hashedPassword,
      stories: Number(stories),
      area: areaArray,
      email,
      NIC: nic,
      TINnumber: tinno
    };

    // Add profile image path if uploaded
    if (req.file) {
      userData.photo = `/useruploads/${req.file.filename}`;
    }

    // Save user to database
    const newUser = new User(userData);
    await newUser.save();

    res.status(201).json({ 
      message: "User registered successfully!",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email
      }
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ 
      message: "Error registering user",
      error: error.message 
    });
  }
});

module.exports = router;