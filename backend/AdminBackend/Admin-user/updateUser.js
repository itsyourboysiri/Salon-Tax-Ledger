const express = require('express');
const router = express.Router();
const UserModel = require('../../user/usermodel'); 

router.put('/update-user/:TINnumber', async (req, res) => {
    try {
      const { TINnumber } = req.params;
      const updatedUser = await UserModel.findOneAndUpdate(
        { TINnumber },
        req.body,
        { new: true }
      );
      if (!updatedUser) return res.status(404).json({ message: 'User not found' });
      res.json(updatedUser);
    } catch (err) {
      res.status(500).json({ message: 'Failed to update user' });
    }
  });
module.exports = router