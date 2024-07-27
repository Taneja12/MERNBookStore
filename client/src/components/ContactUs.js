// src/components/ContactUs.js
import React, { useState } from 'react';
import { sendContactMessage } from '../services/api';
import '../css/ContactUs.css'; // Import the CSS for styling

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await sendContactMessage(formData);
      if (response.status === 200) {
        alert('Message sent successfully!');
        setFormData({ name: '', email: '', message: '' });
      }
    } catch (error) {
      console.error('There was an error sending the message:', error);
      alert('Failed to send the message.');
    }
  };

  return (
    <div className="contact-us-container">
      <div className="contact-us">
        <h2>Contact Us</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Name"
              required
            />
          </div>
          <div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              required
            />
          </div>
          <div>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Message"
              required
            />
          </div>
          <button type="submit">Send</button>
        </form>
      </div>
      <div className="contact-us-image"></div>
    </div>
  );
};

export default ContactUs;
