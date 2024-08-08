import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const EnterPhoneNumber = () => {
  const [phone, setPhone] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { userId } = location.state;

    try {
      const result = await fetch('http://localhost:5000/api/auth/update-phone', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: userId,
          phone: phone
        })
      });

      const data = await result.json();
      localStorage.setItem('token', data.token);
      navigate('/');
    } catch (error) {
      console.error('Error updating phone number:', error);
    }
  };

  return (
    <div>
      <h1>Enter Phone Number</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Phone Number"
          required
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default EnterPhoneNumber;
