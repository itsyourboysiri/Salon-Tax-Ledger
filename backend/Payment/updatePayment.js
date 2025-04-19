const express = require('express');
const router = express.Router();
const Payment = require("../Payment/taxPaymentModal");

router.post('/update-payment/:submissionId', async (req, res) => {
    try {
      const { submissionId } = req.params;
      const { paymentId, orderId, amount, quarter, paidAt } = req.body;
      
      // Find the submission document
      const submission = await  Payment.findById(submissionId);
      
      if (!submission) {
        return res.status(404).json({ success: false, message: 'Submission not found' });
      }
      
      // Initialize paymentDetails if it doesn't exist
      if (!submission.paymentDetails) {
        submission.paymentDetails = { installmentPaid: [] };
      }
      
      // Add the payment record
      submission.paymentDetails.installmentPaid.push({
        paymentId,
        orderId,
        amount: parseFloat(amount),
        quarter,
        paidAt
      });
      
      // Save the updated submission
      await submission.save();
      
      return res.status(200).json({ 
        success: true, 
        message: 'Payment record updated successfully' 
      });
      
    } catch (error) {
      console.error('Error updating payment record:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to update payment record', 
        error: error.message 
      });
    }
  });

  module.exports = router