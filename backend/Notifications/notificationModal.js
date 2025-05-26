const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    message: { type: String, required: true },
    type: { type: String, required: true }, // e.g., 'tax-submission'
    relatedEntity: { type: mongoose.Schema.Types.ObjectId }, // ID of related entity
    read: { type: Boolean, default: false },
    metadata: { type: Object }, // Can include confirmedBy, declinedBy, etc.
    createdAt: { type: Date, default: Date.now },
    recipient: { type: String, required: true },
recipientType: { type: String, enum: ['user', 'admin'], required: true }
  });
  
  module.exports = mongoose.model('Notification', notificationSchema);