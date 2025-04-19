const express = require('express');
const router = express.Router();
const TaxForm = require('./taxForm Modal/taxFormModal'); 

router.post('/insertTaxform', async (req, res) => {
  try {
    const formData = req.body;

    console.log("formData:",formData)

    const taxFormData = new TaxForm(formData);
    await taxFormData.save();


    res.status(201).json({ message: "Tax form submitted successfully",submissionId:taxFormData._id });
    console.log("submissionId:",taxFormData._id)
  } catch (err) {
    console.error("Error saving tax form:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
