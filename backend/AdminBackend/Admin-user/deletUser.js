const express = require('express');
const router = express.Router();
const UserModel = require('../../user/usermodel');

router.delete('/delete-user/:tin', async (req, res) => {
    try {
      const deletedUser = await UserModel.findOneAndDelete({ TINnumber: req.params.tin });
      if (!deletedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error("Delete error:", error);
      res.status(500).json({ message: 'Server error during deletion' });
    }
  });

  module.exports = router