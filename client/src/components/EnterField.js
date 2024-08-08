import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { updatePhoneNumber } from '../services/api'; // API call to update the phone number
import '../css/EnterField.css';


const EnterPhoneNumber = ({ setPhoneNumber }) => {
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await updatePhoneNumber({ phone }, token);
      setPhoneNumber(phone); // Pass the phone number back to PaymentComponent
      navigate(0); // Navigate to the home page or stay on the current page if needed
    } catch (err) {
      console.error(err);
      setError('Failed to update phone number. Please try again.');
    }
  };

  return (
    <div className="enter-phone-container">
      <h3>Enter Your Phone Number</h3>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          placeholder="Enter phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="input"
          required
        />
        <Button type="submit" variant="success" className="btn-block mt-4">Submit</Button>
      </form>
    </div>
  );
};

export default EnterPhoneNumber;
