const express = require('express');
const router = express.Router();
const Payment = require("./taxPaymentModal");
const TaxForm = require("../taxForm/taxForm Modal/TaxFormModal");

router.post('/quaterly-update-payment/:paymentId', async (req, res) => {
  try {
    console.log("Received request to update quarterly payment:", req.body);

    const { paymentId } = req.params;
    const { amount, paidAt, payHereOrderId } = req.body; // ❗ No quarter from frontend anymore

    let paymentDoc = await Payment.findById(paymentId);

    if (!paymentDoc) {
      const taxForm = await TaxForm.findById(paymentId);

      if (!taxForm) {
        return res.status(404).json({ success: false, message: 'Tax Form not found for this payment ID' });
      }

      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth() + 1;
      const taxYear = currentMonth >= 4 
        ? `${currentYear}/${currentYear + 1}`
        : `${currentYear - 1}/${currentYear}`;

      const newPayment = new Payment({
        _id: paymentId,
        username: taxForm.username,
        name: taxForm.name,
        salonname: taxForm.salonName,
        tinNumber: taxForm.tinNumber,
        taxYear: taxYear,
        paymentType: 'quarterly',
        installmentPaid: [],
        isFullyPaid: false,
        amountPaid: 0,
        payHereOrderId: payHereOrderId || null,
      });

      paymentDoc = await newPayment.save();

      // ✅ Also link paymentId to TaxForm
      await TaxForm.findByIdAndUpdate(paymentId, { $set: { paymentId: paymentDoc._id } });
    }

    // ✅ Calculate next quarter based on existing installments
    const nextQuarter = (paymentDoc.installmentPaid.length || 0) + 1;

    if (nextQuarter > 4) {
      return res.status(400).json({ success: false, message: 'All 4 quarters already paid' });
    }

    // ✅ Add the new installment
    paymentDoc.installmentPaid.push({
      quarter: nextQuarter, // ✅ automatic quarter here
      amount: parseFloat(amount),
      paidAt,
    });

    paymentDoc.amountPaid += parseFloat(amount);

    const taxForm = await TaxForm.findById(paymentId);

    if (!taxForm) {
      return res.status(404).json({ success: false, message: 'Tax Form not found when checking payment' });
    }

    const balancePayable = taxForm.balancePayable || 0;

    if (paymentDoc.amountPaid >= balancePayable) {
      paymentDoc.isFullyPaid = true;

      await TaxForm.findByIdAndUpdate(
        paymentId,
        { $set: { paymentStatus: "Paid" } }
      );
    }

    await paymentDoc.save();

    return res.status(200).json({ success: true, message: 'Payment updated successfully', paymentDoc });

  } catch (error) {
    console.error('Error updating payment:', error);
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

module.exports = router;
