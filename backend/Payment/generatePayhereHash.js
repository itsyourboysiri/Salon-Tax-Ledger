const express = require('express');
const crypto = require('crypto');
const router = express.Router();

router.post('/generate-hash', (req, res) => {
  const { merchant_id, order_id, amount, currency } = req.body;

  if (!merchant_id || !order_id || !amount || !currency) {
    return res.status(400).json({ error: 'Missing parameters' });
  }

  const merchant_secret = 'Mzk5NTEyMTQ5ODU5MzEzNzI0NzI4ODY5NzQ5ODEyOTE0NjA4Mjk0'; // ✔ Secure it
  const formattedAmount = parseFloat(amount).toFixed(2);
  const innerHash = crypto.createHash('md5').update(merchant_secret).digest('hex').toUpperCase();
  const finalString = merchant_id + order_id + formattedAmount + currency + innerHash;
  const hash = crypto.createHash('md5').update(finalString).digest('hex').toUpperCase();

  res.json({ hash });

  console.log("Hash",hash)
});

module.exports = router;
