const express = require('express');
const router = express.Router();
const TaxForm = require('../taxForm/taxForm Modal/taxFormModal');
const Payment = require('../Payment/taxPaymentModal');

router.get('/taxview/:username', async (req, res) => {
  const { username } = req.params;

  try {
    const taxForms = await TaxForm.find({ username }).sort({ submittedAt: -1 });
    const payments = await Payment.find({ username });

    const getTaxYearFromDate = (date) => {
      const d = new Date(date);
      const year = d.getFullYear();
      const month = d.getMonth() + 1;
      return month >= 4 ? `${year}/${year + 1}` : `${year - 1}/${year}`;
    };

    const enriched = taxForms.map((form) => {
      const submittedAt = new Date(form.submittedAt);
      const derivedTaxYear = getTaxYearFromDate(submittedAt);
    
      // Filter payments in the same tax year
      const paymentsForYear = payments.filter(
        (payment) => payment.taxYear === derivedTaxYear
      );
    
      // Find the payment closest to the form's submittedAt
      let closestPayment = null;
      let smallestTimeDiff = Infinity;
    
      paymentsForYear.forEach((payment) => {
        const paymentDate = new Date(payment.createdAt);
        const timeDiff = Math.abs(submittedAt - paymentDate); // ms difference
        if (timeDiff < smallestTimeDiff) {
          closestPayment = payment;
          smallestTimeDiff = timeDiff;
        }
      });
    
      const isPaid = closestPayment?.isFullyPaid === true;
    
      return {
        ...form.toObject(),
        paymentStatus: isPaid
          ? "Paid"
          : closestPayment
          ? "Partial"
          : "Unpaid",
      };
    });
    

    res.status(200).json(enriched);
    console.log("Tax view data from backend:", enriched);
  } catch (err) {
    console.error('Error fetching tax forms:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

  
  module.exports = router;