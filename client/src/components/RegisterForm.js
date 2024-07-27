import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../services/api'; // Import the registerUser function
import '../css/RegisterForm.css';

const RegisterForm = () => {
  const navigate = useNavigate(); // Initialize useNavigate hook

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    phone: '', // Add phone to state
  });

  const [error, setError] = useState(''); // Add error state

  const { username, email, password, phone } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await registerUser({
        username,
        email,
        password,
        phone, // Include phone in the request
      });

      console.log(res); // Optional: handle success message

      // Redirect to login page after successful registration
      navigate('/login'); // Navigate to your login route

    } catch (err) {
      console.error(err.message);
      setError(err.response?.data?.msg || 'An error occurred during registration'); // Set error message
    }
  };

  return (
    <div className="register-form-container">
      <h1>Register</h1>
      {error && <div className="error-message">{error}</div>} {/* Conditionally render error message */}
      <form className="form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          name="username"
          value={username}
          onChange={handleChange}
          className="input"
          required
        />
        <input
          type="email"
          placeholder="Email"
          name="email"
          value={email}
          onChange={handleChange}
          className="input"
          required
        />
        <input
          type="password"
          placeholder="Password"
          name="password"
          value={password}
          onChange={handleChange}
          className="input"
          minLength="6"
          required
        />
        <input
          type="text"
          placeholder="Customer Phone"
          name="phone"
          value={phone}
          onChange={handleChange}
          className="input"
          required
        />
        <button type="submit" className="button">Register</button>
      </form>
    </div>
  );
};

export default RegisterForm;
