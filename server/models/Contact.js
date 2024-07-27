// models/Contact.js
const mongoose = require('mongoose');
const moment = require('moment');

const ContactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  sendAt: { type: Date, default: Date.now, required: true },
});

ContactSchema.virtual('formattedSendAt').get(function() {
  return moment(this.sendAt).utcOffset('+05:30').format('YYYY-MM-DDTHH:mm:ss.SSSZ');
});

// Ensure virtual fields are included when converting to JSON
ContactSchema.set('toJSON', { virtuals: true });

const Contact = mongoose.model('Contact', ContactSchema);

module.exports = Contact;
