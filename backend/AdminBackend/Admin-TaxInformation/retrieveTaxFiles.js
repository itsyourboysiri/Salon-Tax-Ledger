// In your admin routes file (assuming it's something like adminRoutes.js)
const express = require('express');
const router = express.Router();
const TaxForm = require('../../taxForm/taxForm Modal/TaxFormModal'); // Adjust this path if needed

// GET all tax submissions
router.get('/tax-submissions', async (req, res) => {
  try {
    // Fetch all tax form submissions
    const taxSubmissions = await TaxForm.find();

    // Enrich with derived fields and convert to plain objects
    const enriched = taxSubmissions.map(sub => {
      // Convert Mongoose document to plain object
      const submission = sub.toObject();
      
      // Add calculated submission year
      submission.submissionYear = submission.submittedAt ? 
        new Date(submission.submittedAt).getFullYear() : null;
        
      return submission;
    });

    console.log("Retrieved tax submissions:", enriched.length);
    res.json(enriched);
  } catch (err) {
    console.error('Error fetching tax submissions:', err);
    res.status(500).json({ message: 'Failed to fetch tax data', error: err.message });
  }
});

module.exports = router;