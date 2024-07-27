// routes/contactRouter.js
const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const sendEmail = require('../utils/sendEmail');

// Route to fetch all contact messages
router.get('/', async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ sendAt: -1 });
    res.status(200).json(contacts);
  } catch (error) {
    console.error('Error fetching contact messages:', error);
    res.status(500).json({ error: 'Failed to fetch contact messages' });
  }
});

router.post('/', async (req, res) => {
  const { name, email, message } = req.body;

  try {
    const newMessage = new Contact({ name, email, message });
    await newMessage.save();

    // Send an immediate response to the client
    res.status(200).json({ message: 'Message sent successfully!' });

    // Perform email sending asynchronously
    const adminEmail = 'deepanshutaneja762@gmail.com';
    const subject = 'New Contact Form Submission';
    const text = `Name: ${name}\nEmail: ${email}\nMessage: ${message}`;
    const userSubject = 'Thank you for contacting us';
    const userText = `Hello ${name},\n\nThank you for reaching out to us. We have received your message and will get back to you shortly.\n\nYour Message:\n${message}\n\nBest regards,\nYour Company Name`;

    // Perform email sending operations after responding to the client
    Promise.all([
      //Can send email to admin also
      sendEmail(email, userSubject, userText)
    ]).catch((error) => {
      console.error('Error sending emails:', error);
    });
  } catch (error) {
    console.error('Error handling contact form submission:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

module.exports = router;
