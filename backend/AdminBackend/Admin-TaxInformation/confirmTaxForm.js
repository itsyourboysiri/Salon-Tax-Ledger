const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const TaxForm = require('../../taxForm/taxForm Modal/TaxFormModal');
const Notification = require('../../Notifications/notificationModal');

// Confirm tax submission
router.put('/confirm-taxsubmission/:id', async (req, res) => {
  const { id } = req.params;
  const { sendNotification, notificationMessage, adminUsername } = req.body;

  try {
    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid submission ID' });
    }

    // Update and return the full document
    const updatedSubmission = await TaxForm.findByIdAndUpdate(
      id,
      { status: 'confirmed' },
      { new: true }
    );

    if (!updatedSubmission) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    // Extract required fields directly from the document
    const { username, name, salonName } = updatedSubmission;

    if (sendNotification) {
      try {
        // Create notification for the USER
        const userNotification = new Notification({
          message: `Your tax submission for ${salonName} has been approved. You can now proceed with payment.`,
          type: 'tax-submission',
          relatedEntity: updatedSubmission._id,
          read: false,
          recipient: username, // Add recipient field to distinguish
          recipientType: 'user',
          metadata: {
            username,
            name,
            salonName,
            confirmedBy: adminUsername,
            action: 'confirmed'
          }
        });

        // Create notification for ADMINS
        const adminNotification = new Notification({
          message: `Tax submission for ${salonName} (${name}) has been confirmed by ${adminUsername}`,
          type: 'admin-action',
          relatedEntity: updatedSubmission._id,
          read: false,
          recipient: 'admin', // Generic admin recipient
          recipientType: 'admin',
          metadata: {
            username,
            name,
            salonName,
            confirmedBy: adminUsername,
            action: 'confirmed',
            targetUser: username
          }
        });
        
        // Save both notifications
        await Promise.all([
          userNotification.save(),
          adminNotification.save()
        ]);
        
        console.log(`User notification created for ${username} (${name}) at ${salonName}`);
        console.log(`Admin notification created for confirmation by ${adminUsername}`);
      } catch (notifError) {
        console.error('Error creating notifications:', notifError);
      }
    }

    res.status(200).json({ 
      message: 'Submission confirmed successfully', 
      data: {
        username,
        name,
        salonName,
        status: 'confirmed',
        confirmedBy: adminUsername
      }
    });
  } catch (error) {
    console.error('Error confirming submission:', error);
    res.status(500).json({ 
      error: 'Failed to confirm submission',
      details: error.message 
    });
  }
});

// Decline tax submission
router.put('/decline-taxsubmission/:id', async (req, res) => {
  const { id } = req.params;
  const { sendNotification, notificationMessage, declineReason, adminUsername } = req.body;

  try {
    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid submission ID' });
    }

    // Update and return the full document
    const updatedSubmission = await TaxForm.findByIdAndUpdate(
      id,
      { status: 'declined', declineReason },
      { new: true }
    );

    if (!updatedSubmission) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    // Extract required fields directly from the document
    const { username, name, salonName } = updatedSubmission;

    if (sendNotification) {
      try {
        // Create notification for the USER
        const userNotification = new Notification({
          message: `Your tax submission for ${salonName} has been declined. Reason: ${declineReason}`,
          type: 'tax-submission',
          relatedEntity: updatedSubmission._id,
          read: false,
          recipient: username,
          recipientType: 'user',
          metadata: {
            username,
            name,
            salonName,
            declinedBy: adminUsername,
            action: 'declined',
            declineReason
          }
        });

        // Create notification for ADMINS
        const adminNotification = new Notification({
          message: `Tax submission for ${salonName} (${name}) has been declined by ${adminUsername}. Reason: ${declineReason}`,
          type: 'admin-action',
          relatedEntity: updatedSubmission._id,
          read: false,
          recipient: 'admin',
          recipientType: 'admin',
          metadata: {
            username,
            name,
            salonName,
            declinedBy: adminUsername,
            action: 'declined',
            declineReason,
            targetUser: username
          }
        });
        
        // Save both notifications
        await Promise.all([
          userNotification.save(),
          adminNotification.save()
        ]);
        
        console.log(`User notification created for ${username} (${name}) at ${salonName}`);
        console.log(`Admin notification created for decline by ${adminUsername}`);
      } catch (notifError) {
        console.error('Error creating notifications:', notifError);
      }
    }

    res.status(200).json({ 
      message: 'Submission declined successfully', 
      data: {
        username,
        name,
        salonName,
        status: 'declined',
        declinedBy: adminUsername,
        declineReason
      }
    });
  } catch (error) {
    console.error('Error declining submission:', error);
    res.status(500).json({ 
      error: 'Failed to decline submission',
      details: error.message 
    });
  }
});

module.exports = router;