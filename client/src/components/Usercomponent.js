import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/UserProfile.css';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');

      try {
        const response = await axios.get('http://localhost:5000/api/auth/user', {
          headers: {
            Authorization: token,
          },
        });

        setUser(response.data);
        setUsername(response.data.username);
        setEmail(response.data.email);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Error fetching user data');
      }
    };

    fetchUser();
  }, []);

  const handleEdit = () => {
    setEditing(true);
  };

  const handleSave = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.put(
        'http://localhost:5000/api/auth/user',
        {
          username,
          email,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );
  
      setUser(response.data);
      setEditing(false);
      setSuccessMessage('Profile Updated Successfully');
      setErrorMessage('');
  
      // Clear success message after a few seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setErrorMessage(error.response.data.message);
      } else {
        console.error('Error updating user data:', error); // Optional: log other errors to console
        setErrorMessage('Error updating user data');
      }
    }
  };
  

  const handleCancel = () => {
    setEditing(false);
    // Reset username and email fields if needed
    setUsername(user.username);
    setEmail(user.email);
    setErrorMessage(''); // Clear any previous error messages
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
    setErrorMessage(''); // Clear any previous error messages
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setErrorMessage(''); // Clear any previous error messages
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="user-profile">
      <h2>User Profile</h2>
      {editing ? (
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={handleUsernameChange}
          />
          <br />
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={handleEmailChange}
          />
          <br />
          <button onClick={handleSave}>Save</button>
          <button onClick={handleCancel}>Cancel</button>
          {errorMessage && <div className="error-message">{errorMessage}</div>}
        </div>
      ) : (
        <div>
          <p>Username: {user.username}</p>
          <p>Email: {user.email}</p>
          <button onClick={handleEdit}>Edit</button>
        </div>
      )}
      {successMessage && <div className="success-message">{successMessage}</div>}
      {/* Display other user details as needed */}
    </div>
  );
};

export default UserProfile;
