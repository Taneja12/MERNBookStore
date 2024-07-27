// utils/sendEmail.js
const nodemailer = require('nodemailer');
require('dotenv').config();

const sendEmail = async (to, subject, text) => {
  try {
    let transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'deepanshutaneja762@gmail.com', // Replace with your email
        pass: process.env.SENDEMAIL_PASS, // Replace with your email password
      },
    });

    let mailOptions = {
      from: 'deepanshutaneja762@gmail.com', // Replace with your email
      to: to,
      subject: subject,
      text: text,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

module.exports = sendEmail;
