const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const TaxForm = require('../../taxForm/taxForm Modal/TaxFormModal'); // adjust path to your model

// Decline tax submission
router.put('/decline-taxsubmission/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid submission ID' });
    }

    const updatedSubmission = await TaxForm.findByIdAndUpdate(
      id,
      { status: 'declined' },
      { new: true }
    );

    if (!updatedSubmission) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    res.status(200).json({ message: 'Submission declined successfully', data: updatedSubmission });
  } catch (error) {
    console.error('Error declining submission:', error);
    res.status(500).json({ error: 'Failed to decline submission' });
  }
});
module.exports = router;