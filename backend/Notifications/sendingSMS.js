const express = require('express');
const router = express.Router();
const TaxForm = require('../taxForm/taxForm Modal/TaxFormModal'); 
const User = require('../user/usermodel'); 
const nodemailer = require('nodemailer');

// Configure email transporter (using Gmail as example)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'asiri.karunachandra@gmail.com', // Your email
    pass:  'qxiy apjh xlsn cecj' // Your app password
  }
});

// Alternative configuration for other email providers
// const transporter = nodemailer.createTransporter({
//   host: 'smtp.your-provider.com',
//   port: 587,
//   secure: false,
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASSWORD
//   }
// });

// New route for sending email notifications
router.post('/notify-user', async (req, res) => {
  try {
    const { username } = req.body;

    // Validate input
    if (!username) {
      return res.status(400).json({ message: "Username is required" });
    }

    // Find user by username to get email address
    const user = await User.findOne({ username: username });
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.email) {
      return res.status(400).json({ message: "User email address not found" });
    }

    // Get pending payment details for the user
    const pendingPayment = await TaxForm.findOne({ 
      username: username,
      paymentId: { $exists: false },
      status: "confirmed" 
    });

    if (!pendingPayment) {
      return res.status(404).json({ message: "No pending payment found for this user" });
    }

    console.log('Sending email to:', user.email);

    // Create email content
    const emailSubject = 'Tax Payment Reminder - Action Required';
    
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Tax Payment Reminder</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin-bottom: 20px; }
          .content { padding: 20px; border: 1px solid #dee2e6; border-radius: 5px; }
          .details { background-color: #e9ecef; padding: 15px; margin: 15px 0; border-radius: 5px; }
          .amount { font-size: 18px; font-weight: bold; color: #dc3545; }
          .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #dee2e6; font-size: 12px; color: #6c757d; }
          .btn { display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px; margin: 10px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>Tax Payment Reminder</h2>
          </div>
          
          <div class="content">
            <p>Dear <strong>${user.name || username}</strong>,</p>
            
            <p>This is a friendly reminder that your tax payment is currently <strong>pending</strong> and requires your immediate attention.</p>
            
            <div class="details">
              <h3>Payment Details:</h3>
              <p><strong>Name:</strong> ${pendingPayment.name}</p>
              <p><strong>Amount:</strong> <span class="amount">LKR ${Number(pendingPayment.balancePayable).toLocaleString()}</span></p>
              <p><strong>Tax Year:</strong> 2025/2026</p>
              <p><strong>Salon:</strong> ${pendingPayment.salonName}</p>
            </div>
            
            <p><strong>Important:</strong> Please complete your payment at your earliest convenience to avoid any penalties or late fees.</p>
            
            <p>If you have any questions or need assistance with your payment, please don't hesitate to contact our support team.</p>
            
            <p>Thank you for your prompt attention to this matter.</p>
            
            <p>Best regards,<br>
            Tax Management Team</p>
          </div>
          
          <div class="footer">
            <p>This is an automated notification. Please do not reply to this email.</p>
            <p>If you believe this email was sent in error, please contact our support team.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const emailText = `
Tax Payment Reminder

Dear ${user.name || username},

This is a reminder that your tax payment is pending.

Payment Details:
- Name: ${pendingPayment.name}
- Amount: LKR ${Number(pendingPayment.balancePayable).toLocaleString()}
- Tax Year: 2025/2026
- Salon: ${pendingPayment.salonName}

Please complete your payment at your earliest convenience to avoid any penalties or late fees.

If you have any questions or need assistance, please contact our support team.

Thank you for your prompt attention to this matter.

Best regards,
Tax Management Team

---
This is an automated notification. Please do not reply to this email.
    `;

    // Prepare email options
    const mailOptions = {
      from: {
        name: 'Tax Management System',
        address: process.env.EMAIL_USER || 'asiri.karunachandra@gmail.com'
      },
      to: user.email,
      subject: emailSubject,
      text: emailText,
      html: emailHtml
    };

    // Send email
    const emailResult = await transporter.sendMail(mailOptions);
    
    console.log('Email sent successfully:', {
      messageId: emailResult.messageId,
      to: user.email,
      subject: emailSubject
    });

    res.status(200).json({ 
      message: "Email notification sent successfully",
      messageId: emailResult.messageId,
      to: user.email,
      subject: emailSubject
    });

  } catch (error) {
    console.error('Error sending email notification:', error);
    
    // Handle specific email errors
    if (error.code === 'EAUTH') {
      return res.status(401).json({ 
        message: "Email authentication failed. Please check your email credentials.",
        error: "Authentication Error"
      });
    }
    
    if (error.code === 'ENOTFOUND') {
      return res.status(500).json({ 
        message: "Email server not found. Please check your email configuration.",
        error: "Server Not Found"
      });
    }

    res.status(500).json({ 
      message: "Failed to send email notification",
      error: error.message 
    });
  }
});

// Route to test email configuration
router.get('/test-email', async (req, res) => {
  try {
    // Verify email transporter configuration
    await transporter.verify();
    res.json({ 
      message: "Email configuration is valid",
      status: "OK" 
    });
  } catch (error) {
    console.error('Email configuration test failed:', error);
    res.status(500).json({ 
      message: "Email configuration test failed",
      error: error.message 
    });
  }
});

module.exports = router;