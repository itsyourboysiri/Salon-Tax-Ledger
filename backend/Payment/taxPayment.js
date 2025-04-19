const express = require('express');
const router = express.Router();
const crypto = require('crypto');

// Middleware to parse x-www-form-urlencoded from PayHere
router.use(express.urlencoded({ extended: true }));

// PayHere notification endpoint
router.post('/payhere-notify', express.urlencoded({ extended: true }), (req, res) => {
  const {
    merchant_id,
    order_id,
    payhere_amount,
    payhere_currency,
    status_code,
    md5sig,
  } = req.body;

  const merchant_secret = process.env.MERCHANT_SECRET;

  const localMd5Sig = crypto
    .createHash('md5')
    .update(
      merchant_id +
        order_id +
        payhere_amount +
        payhere_currency +
        status_code +
        crypto.createHash('md5').update(merchant_secret).digest('hex').toUpperCase()
    )
    .digest('hex')
    .toUpperCase();

  if (md5sig === localMd5Sig && status_code === '2') {
    // ✅ Payment is verified
    console.log('Payment verified for:', order_id);
    // TODO: Update database with success status
  } else {
    console.log('Invalid or failed payment notification.');
  }

  res.sendStatus(200); // Always respond with 200 to avoid PayHere retries
});


module.exports = router;