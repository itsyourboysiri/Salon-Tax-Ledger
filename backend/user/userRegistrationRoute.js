const express = require("express");
const User = require("./usermodel");
const bcrypt = require("bcryptjs"); // Import bcrypt for hashing

const router = express.Router();

// Helper functions for validation
const validatePhoneNumber = (phone) => /^0[1-9]\d{8}$/.test(phone);
const validatePassword = (password) => password.length > 5 && /[!@#$%^&*(),.?":{}|<>]/.test(password);
const validateNIC = (nic) => /^[0-9]{9}[VXvx]$|^[0-9]{12}$/.test(nic);
const validateTIN = (tinno) => /^[0-9]+$/.test(tinno);

// Register user
router.post("/", async (req, res) => {
    try {
        const { name, dob, address, phone, salonName, salonAddress, username, password, confirmPassword, stories, area,nic, tinno,email } = req.body;

        
        // Server-side validation
        if (!name || !dob || !address || !phone || !salonName || !salonAddress || !username || !password || !confirmPassword || !stories || !area|| !nic || !tinno ||!email) {
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

        if (stories <= 0 || !Array.isArray(area) || area.some(a => a <= 0)) {
            return res.status(400).json({ message: "Stories and area values must be positive numbers" });
        }

        if (!validateNIC(nic)) {
            return res.status(400).json({ message: "Invalid NIC format (e.g., 123456789V or 200012345678)" });
        }

        if (!validateTIN(tinno)) {
            return res.status(400).json({ message: "TIN number should only contain numbers" });
        }
        // Hash the password before saving it
        const salt = await bcrypt.genSalt(10); // Generate salt
        const hashedPassword = await bcrypt.hash(password, salt); // Hash password

        // Save user to the database
        const newUser = new User({
            name,
            dob,
            address,
            phone,
            salonName,
            salonAddress,
            username,
            password: hashedPassword, // Store the hashed password
            stories,
            area,
            email:email,
            NIC : nic,
            TINnumber : tinno
        });
        await newUser.save();

        res.status(201).json({ message: "User registered successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Error registering user", error });
    }
});

module.exports = router;
