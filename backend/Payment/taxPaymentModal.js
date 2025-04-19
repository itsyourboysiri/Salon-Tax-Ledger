
const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  username: { type: String, required: true },
  name: { type: String, required: true },
  salonname: { type: String, required: true },

  tinNumber: { type: String, required: true },
  taxYear: { type: String, required: true }, // e.g., "2023/2024"
  
  paymentType: { type: String, enum: ['quarterly', 'full'], required: true },

  installmentPaid: [
    {
      quarter: {
        type: Number,
        required: true,
      },
      amount: {
        type: Number,
        required: true,
      },
      paidAt: {
        type: Date,
        default: Date.now,
      }
    }
  ], 
  isFullyPaid: { type: Boolean, default: false },
  amountPaid: { type: Number, required: true },

  payHereOrderId: { type: String },
  paidAt: [{ type: Date }],

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Payment_collection', paymentSchema);