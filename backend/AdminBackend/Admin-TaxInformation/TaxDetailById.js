const express = require('express');
const router = express.Router();
const TaxForm = require('../../taxForm/taxForm Modal/taxFormModal'); // Adjust path as needed

// GET a specific tax submission by ID
router.get('/fetch-taxsubmission/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const taxForm = await TaxForm.findById(id);

    if (!taxForm) {
      return res.status(404).json({ message: 'Tax submission not found' });
    }

    res.json(taxForm);
  } catch (err) {
    console.error('Error fetching tax form:', err);
    res.status(500).json({ message: 'Server error retrieving tax form' });
  }
});

module.exports = router;
