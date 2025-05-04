const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const TaxForm = require("../taxForm/taxForm Modal/TaxFormModal"); // adjust the path to your actual model

// GET tax submission by ID
router.get("/taxviewbyid/:id", async (req, res) => {
  try {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid document ID" });
    }

    const taxForm = await TaxForm.findById(id);

    if (!taxForm) {
      return res.status(404).json({ message: "Submission not found" });
    }

    res.status(200).json(taxForm);
  } catch (err) {
    console.error("Error fetching tax submission by ID:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});
module.exports = router;