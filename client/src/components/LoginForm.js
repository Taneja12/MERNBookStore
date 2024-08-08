import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { loginUser } from '../services/api';
import { Form, Button, Alert } from 'react-bootstrap';
import AOS from 'aos';
import 'aos/dist/aos.css';
import '../css/LoginForm.css';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

// const BASE_URL ="https://mern-book-store-deepanshu-tanejas-projects.vercel.app"; // Use the production base URL
const BASE_URL = "http://localhost:5000"

const LoginForm = ({ setIsAuthenticated }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [redirectMessage, setRedirectMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    AOS.init();
    if (location.state && location.state.message) {
      setRedirectMessage(location.state.message);
    }
  }, [location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await loginUser(username, password);
      localStorage.setItem('token', data.token);
      setIsAuthenticated(true);
      navigate('/');
      window.location.reload();
    } catch (error) {
      if (error.response) {
        console.error('Login error:', error.response.data.message);
        setError(error.response.data.message);
      } else if (error.request) {
        console.error('No response received:', error.request);
        setError('No response received');
      } else {
        console.error('Error:', error.message);
        setError('Error during request');
      }
    }
  };

  const handleGoogleSuccess = (response) => {
    console.log('Google Login Success:', response);
    fetch(`${BASE_URL}/api/auth/google`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        idToken: response.credential // Ensure this field matches the token field in your response
      })
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        localStorage.setItem('token', data.token);
        setIsAuthenticated(true);
        navigate('/');
      })
      .catch(error => {
        console.error('Error during authentication:', error);
        setError('Google login failed. Please try again.');
      });
  };
  

  const handleGoogleFailure = (error) => {
    console.error('Google Login Failed:', error);
    setError('Google login failed. Please try again.');
  };

  return (
    <div className="form-container">
      <div className="form-wrapper" data-aos="fade-up" data-aos-duration="1000">
        <h1>Login</h1>
        {redirectMessage && <Alert variant="info" className="redirect-message">{redirectMessage}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="username">
            <Form.Control
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input-field"
              placeholder="Username"
              required
            />
          </Form.Group>
          <Form.Group controlId="password">
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              placeholder="Password"
              required
            />
          </Form.Group>
          <Button type="submit" className="button1" variant="primary">
            Login
          </Button>
        </Form>
        {error && <Alert variant="danger" className="error-message">{error}</Alert>}
        <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onFailure={handleGoogleFailure}
            cookiePolicy={'single_host_origin'}
          />
        </GoogleOAuthProvider>
        <div className="links-container">
          <div className="forgot-password">
            <a href="/forgot-password" className="forgot-password-link">Forgot your password?</a>
          </div>
          <div className="register-link">
            <p className="register-text">Don't have an account?</p>
            <a href="/register" className="register-link-text">Register</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
