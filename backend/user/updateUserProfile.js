const express = require('express');
const router = express.Router();
const UserModel = require('./usermodel') 
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, 'public', 'useruploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, 'photo-' + Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

router.put('/update-userprofile/:username', upload.single('photo'), async (req, res) => {
    const { username } = req.params;
    const updatedData = req.body;
  
    try {
      if (req.file) {
        updatedData.photo = `/useruploads/${req.file.filename}`;
    }

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

// Add this route to serve uploaded images
router.get('/useruploads/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, 'public', 'useruploads', filename);
  
  // Check if file exists
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).json({ message: 'Image not found' });
  }
});
  
module.exports = router