import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Alert } from 'react-bootstrap';
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
    <div className="form-container">
      <div className="form-wrapper">
        <h1>Register</h1>
        {error && <div className="error-message">{error}</div>}
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formUsername">
            <Form.Control
              type="text"
              placeholder="Username"
              name="username"
              value={username}
              onChange={handleChange}
              className="input-field"
              required
            />
          </Form.Group>
          <Form.Group controlId="formEmail">
            <Form.Control
              type="email"
              placeholder="Email"
              name="email"
              value={email}
              onChange={handleChange}
              className="input-field"
              required
            />
          </Form.Group>
          <Form.Group controlId="formPassword">
            <Form.Control
              type="password"
              placeholder="Password"
              name="password"
              value={password}
              onChange={handleChange}
              className="input-field"
              minLength="6"
              required
            />
          </Form.Group>
          <Form.Group controlId="formPhone">
            <Form.Control
              type="text"
              placeholder="Customer Phone"
              name="phone"
              value={phone}
              onChange={handleChange}
              className="input-field"
              required
            />
          </Form.Group>
          <Button type="submit" className="button1" variant="primary">Register</Button>
        </Form>

        <div className="or-container">
          <div className="divider"></div>
          <span className="or-text">or</span>
          <div className="divider"></div>
        </div>

        <div className="google-signup">
          <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onFailure={handleGoogleFailure}
              cookiePolicy={'single_host_origin'}
            />
          </GoogleOAuthProvider>
        </div>

        <div className="links-container">
        <div className="login-link">
            <p className="register-text">Already have an account? </p>
            <a href="/register" className="register-link-text">Login</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
