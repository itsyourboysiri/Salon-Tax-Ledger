const express = require('express');
const router = express.Router();
const TaxForm = require('../taxForm/taxForm Modal/TaxFormModal');
const Payment = require('../Payment/taxPaymentModal');

router.get('/reportdata/:username', async (req, res) => {
  const { username } = req.params;

  try {
    const taxForms = await TaxForm.find({ username });
    const payments = await Payment.find({ username });

    const reportData = taxForms.map(taxForm => {
      const relatedPayment = payments.find(p => p._id.toString() === taxForm.paymentId);      

      const incomeSources = {
        employment: taxForm.totalEmployeeIncome || 0,
        business: taxForm.totalBusinessIncome || 0,
        foreign: taxForm.totalForeignIncome || 0,
      };

      const installments = relatedPayment?.installmentPaid?.map(inst => ({
        amount: inst.amount,
        paidAt: inst.paidAt.toISOString().split('T')[0], // Format date as YYYY-MM-DD
      })) || [];

      return {
        date: taxForm.submittedAt?.toISOString().split('T')[0] || null,
        taxYear: relatedPayment?.taxYear || null,
        name: taxForm.name,
        salonName: taxForm.salonName,
        username: taxForm.username,
        status: taxForm.status || 'pending',
        totalTaxPayable: taxForm.balancePayable || 0,
        totalTaxPaid: relatedPayment?.amountPaid || 0,
        incomeSources,
        paymentType: relatedPayment?.paymentType || null,
        installments
      };
    });

    console.log('Report Data:', reportData);
    res.json(reportData.filter(entry => entry.status === "confirmed"));

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch tax summaries' });
  }
});


  module.exports = router;