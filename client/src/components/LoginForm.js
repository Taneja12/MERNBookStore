// src/components/LoginForm.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/api'; // Import the service function
import '../css/LoginForm.css'; // Import CSS file

const LoginForm = ({ setIsAuthenticated }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await loginUser(username, password);
      localStorage.setItem('token', data.token);
      setIsAuthenticated(true);
      // Redirect to home page after successful login
      navigate('/');
      window.location.reload(); // Reload the page to load the userId
    } catch (error) {
      if (error.response) {
        console.error('Login error:', error.response.data.message);
        setError(error.response.data.message); // Set specific error message
      } else if (error.request) {
        console.error('No response received:', error.request);
        setError('No response received'); // Set general error message
      } else {
        console.error('Error:', error.message);
        setError('Error during request'); // Set general error message
      }
    }
  };

  return (
    <div className="form-container">
      <div className="form-wrapper">
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="input-field"
            placeholder="Username"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field"
            placeholder="Password"
          />
          <button type="submit" className="button1">
            Login
          </button>
        </form>
        {error && <p className="error-message">{error}</p>}
        <div className="forgot-password">
          <a href="/forgot-password" className="forgot-password-link">Forgot your password?</a>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
