const express = require('express');
const router = express.Router();
const Payment = require('./taxPaymentModal'); // Adjust path

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
    paidAt
  } = req.body;

  try {
    const newPayment = new Payment({
      username,
      name,
      salonname:salonName,
      tinNumber,
      taxYear,
      paymentType,
      installmentPaid,
      isFullyPaid,
      amountPaid,
      payHereOrderId,
      paidAt,
    });

    await newPayment.save();
    res.status(201).json({
      message: 'Payment saved successfully',
      paymentId: newPayment._id
    });
  } catch (err) {
    console.error("DB Save Error:", err);
    res.status(500).json({ error: 'Failed to save payment' });
  }
});

module.exports = router;
