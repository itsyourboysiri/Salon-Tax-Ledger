const express = require('express');
const router = express.Router();
const Payment = require('./taxPaymentModal'); // Adjust your path if needed
const TaxForm = require('../taxForm/taxForm Modal/TaxFormModal'); // Adjust your path if needed

// POST /save-payment
router.post('/save-payment', async (req, res) => {
  const {
    username,
    name,
    salonName,
    tinNumber,
    taxYear,
    paymentType,
    installmentPaid,
    isFullyPaid,
    amountPaid,
    payHereOrderId,
    paidAt,
    submissionId // ✅ Important: receive submissionId
  } = req.body;

  try {
    // ✅ Save the new Payment document
    const newPayment = new Payment({
      username,
      name,
      salonname: salonName,
      tinNumber,
      taxYear,
      paymentType,
      installmentPaid,
      isFullyPaid,
      amountPaid,
      payHereOrderId,
      paidAt,
    });

    const savedPayment = await newPayment.save();

    // ✅ After saving Payment, update corresponding TaxForm
    const updatedTaxForm = await TaxForm.findByIdAndUpdate(
      submissionId,
      { 
        $set: { 
          paymentStatus: "Paid", // Mark as Paid
          paymentId: savedPayment._id // Link the paymentId into TaxForm
        }
      },
      { new: true }
    );

    if (!updatedTaxForm) {
      return res.status(404).json({ error: 'TaxForm not found' });
    }

    res.status(201).json({
      message: 'Payment saved and TaxForm updated successfully',
      paymentId: savedPayment._id
    });

  } catch (err) {
    console.error("Error in /save-payment:", err);
    res.status(500).json({ error: 'Server error while saving payment' });
  }
});

module.exports = router;
