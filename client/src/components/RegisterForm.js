import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser, googleSignup } from '../services/api'; // Import the registerUser and googleSignup functions
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import '../css/RegisterForm.css';

const RegisterForm = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    phone: '',
  });

  const [error, setError] = useState('');

  const { username, email, password, phone } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await registerUser({ username, email, password, phone });
      // console.log(res);

      navigate('/login');
    } catch (err) {
      console.error(err.message);
      setError(err.response?.data?.msg || 'An error occurred during registration');
    }
  };

  const handleGoogleSuccess = async (response) => {
    // console.log('Google Signup Success:', response);
    try {
      const data = await googleSignup(response.credential);
      console.log(data);

      localStorage.setItem('token', data.token); // Save the token if needed
      setIsAuthenticated(true);
      if (!data.user.phone) {
        // If the phone number is missing, redirect to the phone number input page
        navigate('/enter-phone');
      } else {
        navigate('/'); // Redirect to the homepage if the phone number is present
        window.location.reload();
      }
    } catch (error) {
      console.error('Error during Google signup:', error);
      setError('Google signup failed. Please try again.');
    }
  };

  const handleGoogleFailure = (error) => {
    console.error('Google Signup Failed:', error);
    setError('Google signup failed. Please try again.');
  };

  return (
    <div className="register-form-container">
      <h1>Register</h1>
      {error && <div className="error-message">{error}</div>}
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

      <div className="google-signup">
        <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onFailure={handleGoogleFailure}
            cookiePolicy={'single_host_origin'}
          />
        </GoogleOAuthProvider>
      </div>
    </div>
  );
};

export default RegisterForm;
