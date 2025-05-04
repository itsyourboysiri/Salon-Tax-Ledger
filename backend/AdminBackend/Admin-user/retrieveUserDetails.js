const express = require('express');
const router = express.Router();
const UserModel = require('../../user/usermodel');

// GET all users with image renamed to photo
router.get('/all-users', async (req, res) => {
  try {
    const users = await UserModel.find({}, {
      TINnumber: 1,
      name: 1,
      salonName: 1,
      email: 1,
      photo: 1,
      _id: 0
    }).lean(); // 👈 convert to plain JS object

    const usersWithPhoto = users.map(user => ({
      ...user,
      photo: user.photo || '', // ✅ rename 'image' to 'photo'
    }));

    res.json(usersWithPhoto);
    // console.log("Retrieved users:",usersWithPhoto)
  } catch (err) {
    console.error('Error fetching user details:', err);
    res.status(500).json({ message: 'Error fetching users' });
  }
});

module.exports = router;
