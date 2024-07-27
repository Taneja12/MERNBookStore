import React, { useState, useEffect } from 'react';
import { fetchUserDetails, updateUserDetails } from '../services/api'; // Adjust the path as needed
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
      try {
        const userData = await fetchUserDetails();
        setUser(userData);
        setUsername(userData.username);
        setEmail(userData.email);
      } catch (error) {
        setError('Error fetching user data');
      }
    };

    fetchUser();
  }, []);

  const handleEdit = () => {
    setEditing(true);
  };

  const handleSave = async () => {
    try {
      const updatedUser = await updateUserDetails(username, email);
      setUser(updatedUser);
      setEditing(false);
      setSuccessMessage('Profile Updated Successfully');
      setErrorMessage('');
      
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage('Error updating user data');
      }
    }
  };

  const handleCancel = () => {
    setEditing(false);
    setUsername(user.username);
    setEmail(user.email);
    setErrorMessage('');
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
    setErrorMessage('');
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setErrorMessage('');
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
    </div>
  );
};

export default UserProfile;
