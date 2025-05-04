const express = require('express');
const router = express.Router();
const Payment = require('./taxPaymentModal');

router.get('/payment-history/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const payments = await Payment.find({ username });
    return res.status(200).json(payments);
  } catch (error) {
    console.error("Error fetching payment history:", error);
    return res.status(500).json({ error: "Server Error" });
  }
});

module.exports = router;
