import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { loginUser } from '../services/api'; // Import the service function
import { Form, Button, Alert } from 'react-bootstrap';
import AOS from 'aos';
import 'aos/dist/aos.css';
import '../css/LoginForm.css'; // Import CSS file

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
