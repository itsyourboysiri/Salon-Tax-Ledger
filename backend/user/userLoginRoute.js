const express = require("express");
const User = require("./usermodel");
const bcrypt = require("bcryptjs");

const router = express.Router();

router.post('/', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // ✅ Return only required fields
        const { name, salonName, TINnumber,email,photo } = user;

        res.json({
            message: 'Login successful',
            user: {
                username,
                name,
                salonName,
                tinNumber:TINnumber,
                email,
                photo
            }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
