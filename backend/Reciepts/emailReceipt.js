const express = require('express');
const nodemailer = require('nodemailer');
const PDFDocument = require('pdfkit');
const path = require('path');
const fs = require('fs');
const router = express.Router();

router.post('/send-receipt', async (req, res) => {
  const {
    name,
    email,
    tinNumber,
    salonName,
    paymentType,
    taxYear,
    amountPaid,
    payHereOrderId,
    paymentDate,
  } = req.body;

  console.log("Recipient:",email)

  try {
    const doc = new PDFDocument({ margin: 50 });
    const buffers = [];

    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', async () => {
      const pdfBuffer = Buffer.concat(buffers);

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'asiri.karunachandra@gmail.com',
          pass: 'qxiy apjh xlsn cecj',
        },
      });

      const mailOptions = {
        from: 'asiri.karunachandra@gmail.com',
        to: email,
        subject: 'Income Tax Payment Receipt',
        text: 'Please find attached your payment receipt.',
        attachments: [
          {
            filename: 'Tax-Receipt.pdf',
            content: pdfBuffer,
            contentType: 'application/pdf',
          },
        ],
      };

      await transporter.sendMail(mailOptions);
      res.status(200).json({ message: 'Receipt sent successfully' });
    });

    // === HEADER ===
    // doc.image(path.join(__dirname, 'D:/Final project/salon-tax-system-reactjs/public/logo.png'), 50, 45, { width: 60 }) // optional
    doc
      .fontSize(20)
      .fillColor('#380817')
      .text('Income Tax Payment Receipt', { align: 'center' })
      .moveDown();

    // === RECEIPT BOX ===
    doc
      .roundedRect(40, 100, 520, 350, 10)
      .stroke('#986611');

    doc
      .fontSize(12)
      .fillColor('black')
      .text(`Name:`, 60, 120)
      .font('Helvetica-Bold')
      .text(`${name}`, 150, 120)
      .font('Helvetica')
      .text(`Email:`, 60, 145)
      .font('Helvetica-Bold')
      .text(`${email}`, 150, 145)
      .font('Helvetica')
      .text(`TIN Number:`, 60, 170)
      .font('Helvetica-Bold')
      .text(`${tinNumber}`, 150, 170)
      .font('Helvetica')
      .text(`Salon Name:`, 60, 195)
      .font('Helvetica-Bold')
      .text(`${salonName}`, 150, 195)
      .font('Helvetica')
      .text(`Payment Type:`, 60, 220)
      .font('Helvetica-Bold')
      .text(`${paymentType}`, 150, 220)
      .font('Helvetica')
      .text(`Tax Year:`, 60, 245)
      .font('Helvetica-Bold')
      .text(`${taxYear}`, 150, 245)
      .font('Helvetica')
      .text(`Amount Paid:`, 60, 270)
      .font('Helvetica-Bold')
      .text(`LKR ${parseFloat(amountPaid).toLocaleString(undefined, { minimumFractionDigits: 2 })}`, 150, 270)
      .font('Helvetica')
      .text(`Order ID:`, 60, 295)
      .font('Helvetica-Bold')
      .text(`${payHereOrderId}`, 150, 295)
      .font('Helvetica')
      .text(`Payment Date:`, 60, 320)
      .font('Helvetica-Bold')
      .text(`${paymentDate}`, 150, 320);

    // === FOOTER ===
    doc
      .fontSize(10)
      .fillColor('gray')
      .text('This is a system-generated receipt and does not require a signature.', 50, 470, {
        align: 'center',
      });

    doc.end();

  } catch (err) {
    console.error('Error sending receipt:', err);
    res.status(500).json({ error: 'Failed to send receipt' });
  }
});

module.exports = router;
