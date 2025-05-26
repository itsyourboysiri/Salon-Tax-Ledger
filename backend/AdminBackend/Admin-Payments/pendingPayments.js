
const express = require('express');
const router = express.Router();
const TaxForm = require('../../taxForm/taxForm Modal/TaxFormModal'); // adjust path

router.get('/pending-payments', async (req, res) => {
  try {
    const pendingPayments = await TaxForm.find({ 
      paymentId: { $exists: false }, // or { $in: [null, undefined] }
      status: "confirmed" 
    });
    res.status(200).json(pendingPayments);
  } catch (error) {
    console.error('Error fetching pending payments:', error);
    res.status(500).json({ message: "Internal Server Error" });
  }
  });
  module.exports = router;