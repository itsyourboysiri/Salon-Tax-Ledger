const express = require('express');
const router = express.Router();
const UserModel = require('../../user/usermodel');

router.get('/:tin', async (req, res) => {
    console.log("tin:",req.params.tin)
    try {
      const user = await UserModel.findOne({ TINnumber: req.params.tin });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
     
    } catch (err) {
      console.error('Failed to fetch user by TIN:', err);
      res.status(500).json({ message: 'Server error' });
    }
  });

module.exports = router