// src/components/ContactMessages.js
import React, { useState, useEffect } from 'react';
import { fetchContactMessages } from '../services/api';
import '../css/Contact.css';

const ContactMessages = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getContacts = async () => {
      try {
        const data = await fetchContactMessages();
        setContacts(data);
      } catch (error) {
        console.error('Error fetching contact messages:', error);
        setError('Error fetching contact messages');
      } finally {
        setLoading(false);
      }
    };

    getContacts();
  }, []);

  if (loading) return <p>Loading contact messages...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="contact-messages">
      <h2>Contact Messages</h2>
      {contacts.length === 0 ? (
        <p>No contact messages found.</p>
      ) : (
        <ul className="contact-list">
          {contacts.map(contact => (
            <li key={contact._id} className="contact-item">
              <div className="contact-details">
                <h3>{contact.name}</h3>
                <p>Email: {contact.email}</p>
                <p>Message: {contact.message}</p>
                <p className="contact-date">Sent At: {new Date(contact.sendAt).toLocaleString()}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ContactMessages;
