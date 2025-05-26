const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const TaxForm = require('../../taxForm/taxForm Modal/TaxFormModal'); // adjust path to your model

// Decline tax submission
router.put('/decline-taxsubmission/:id', async (req, res) => {
  const { id } = req.params;
  const { sendNotification, notificationMessage, declineReason, adminUsername } = req.body;
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
    const { username, name, salonName } = updatedSubmission;

    if (sendNotification) {
      try {
        const notification = new Notification({
          message: notificationMessage || `Your tax submission for ${salonName} has been declined`,
          type: 'tax-submission',
          relatedEntity: updatedSubmission._id,
          read: false,
          metadata: {
            username,
            name,
            salonName,
            declinedBy: adminUsername, // Add admin username to metadata
            declineReason,
            action: 'declined'
          }
        });
        
        await notification.save();
        console.log(`Submission declined by ${adminUsername} for ${username} (${name}) at ${salonName}`);
      } catch (notifError) {
        console.error('Error creating notification:', notifError);
      }
    }

    res.status(200).json({ message: 'Submission declined successfully', data: updatedSubmission });
  } catch (error) {
    console.error('Error declining submission:', error);
    res.status(500).json({ error: 'Failed to decline submission' });
  }
});
module.exports = router;