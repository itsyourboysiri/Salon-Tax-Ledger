const express = require('express');
const router = express.Router();
const UserModel = require('./usermodel') 


router.put('/update-userprofile/:username', async (req, res) => {
    const { username } = req.params;
    const updatedData = req.body;
  
    try {
      const updatedUser = await UserModel.findOneAndUpdate(
        { username },
        updatedData,
        { new: true }
      );
  
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.json(updatedUser);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to update user" });
    }
  });
  
  module.exports = router