const express = require('express');
const router = express.Router();
const TaxForm = require('./taxForm Modal/taxFormModal'); // Adjust path if needed
const Payment = require("../Payment/taxPaymentModal");

// GET /api/users/taxsubmission/:id
router.get('/fetch-taxsubmission/:id', async (req, res) => {
    try {
        const submission = await TaxForm.findById(req.params.id);
        if (!submission) return res.status(404).json({ message: "Submission not found" });
    
        let payment = null;
    
        if (submission.paymentId) {
          payment = await Payment.findById(submission.paymentId);
        }
    
        res.status(200).json({ ...submission.toObject(), paymentDetails: payment });
        console.log("Fetched Payment data:",payment)
      } catch (err) {
        console.error("Error fetching submission with payment:", err);
        res.status(500).json({ error: "Server error" });
      }
  });
  module.exports = router;
  