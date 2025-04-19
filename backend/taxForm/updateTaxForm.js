const express = require('express');
const router = express.Router();
const TaxForm = require('./taxForm Modal/taxFormModal');

router.put('/update-taxsubmission/:id', async (req, res) => {
    const { id } = req.params;
    const { paymentId } = req.body;
  
    try {
      const updated = await TaxForm.findByIdAndUpdate(
        id,
        { $set: { paymentId:paymentId } },
        { new: true }
      );
  
      if (!updated) return res.status(404).json({ message: "Submission not found" });
  
      res.status(200).json({ message: "Tax submission updated with paymentId", updated });
    } catch (err) {
      console.error("Failed to update submission:", err);
      res.status(500).json({ error: "Server error" });
    }
  });
  
  module.exports = router