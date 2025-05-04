const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const TaxForm = require('../../taxForm/taxForm Modal/taxFormModal'); // Replace with actual model path

// Confirm tax submission
router.put('/confirm-taxsubmission/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid submission ID' });
    }

    const updatedSubmission = await TaxForm.findByIdAndUpdate(
      id,
      { status: 'confirmed' },
      { new: true }
    );

    if (!updatedSubmission) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    res.status(200).json({ message: 'Submission confirmed successfully', data: updatedSubmission });
  } catch (error) {
    console.error('Error confirming submission:', error);
    res.status(500).json({ error: 'Failed to confirm submission' });
  }
});
module.exports = router;