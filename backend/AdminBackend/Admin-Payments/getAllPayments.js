const express = require('express');
const router = express.Router();
const Payment = require('../../Payment/taxPaymentModal'); // adjust path

router.get('/all-payments', async (req, res) => {
  try {
    // console.log("Entered the all-payments route"); // Log to check if the route is hit
    const payments = await Payment.find({}).sort({ createdAt: -1 });
    // console.log("Payments retrieved:",payments); // Log the payments to check the data structure
    res.status(200).json(payments);
    
  } catch (error) {
    console.error('Error fetching all payments:', error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
