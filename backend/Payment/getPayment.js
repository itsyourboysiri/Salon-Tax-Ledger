const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Payment = require("./taxPaymentModal");
const TaxForm = require("../taxForm/taxForm Modal/TaxFormModal");

// Fetch Payment by Payment ID
router.get('/payment/:paymentId', async (req, res) => {
  try {
    const { paymentId } = req.params;
    const payment = await Payment.findById(paymentId);

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    // ✅ If isFullyPaid true, update TaxForm where paymentId matches
    if (payment.isFullyPaid) {
      await TaxForm.findOneAndUpdate(
        { paymentId: paymentId }, // <-- find by paymentId field, not _id
        { $set: { paymentStatus: "Paid" } }
      );
    }

    res.status(200).json({
      amountPaid: payment.amountPaid,
      isFullyPaid: payment.isFullyPaid,
    });

  } catch (error) {
    console.error("Error fetching payment by ID:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
