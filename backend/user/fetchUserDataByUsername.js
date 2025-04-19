const express = require('express');
const router = express.Router();
const UserModel = require('./usermodel') 

router.get('/userprofile/:username', async (req, res) => {
    const { username } = req.params;
  
    try {
      const user = await UserModel.findOne({ username });
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.json(user);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error fetching user' });
    }
  });

  module.exports = router