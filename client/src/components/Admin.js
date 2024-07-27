import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/Admin.css'; // Import your CSS file for AdminPage styling
import { fetchUserDetails } from '../services/api'; // Import fetchUserDetails function

const AdminPage = () => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [category, setCategory] = useState('');
  const [error, setError] = useState(null); // State for error handling
  const [isAdmin, setIsAdmin] = useState(false); // State to check if the user is an admin

  // Define your categories as an array of options
  const categories = [
    'Fiction',
    'Romance',
    'AutoBiography',
    'History',
    'Business',
    'Crime'
    // Add more categories as needed
  ];

  useEffect(() => {
    const getUserDetails = async () => {
      try {
        const user = await fetchUserDetails();
        if (user.role === 'admin') {
          setIsAdmin(true);
        } else {
          setError('Access denied. Admins only.');
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
        setError('Failed to fetch user details. Please try again.');
      }
    };

    getUserDetails();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/api/books', {
        title,
        author,
        description,
        price: parseFloat(price), // Ensure price is converted to a number
        imageUrl,
        category,
      }, {
        headers: {
          'Authorization': `Bearer ${token}` // Send the token in the Authorization header
        }
      });

      if (response.status === 201) {
        alert('Book added successfully!');
        setTitle('');
        setAuthor('');
        setDescription('');
        setPrice('');
        setImageUrl('');
        setCategory(''); // Clear category state
        setError(null); // Clear any previous errors
      } else {
        throw new Error('Failed to add book');
      }
    } catch (error) {
      console.error('Error adding book:', error);
      setError('Failed to add book. Please try again.');
    }
  };

  if (!isAdmin) {
    return <p>{error || 'Loading...'}</p>;
  }

  return (
    <div className="admin-page">
      <h2>Add New Book</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder='TITLE OF THE BOOK' value={title} onChange={(e) => setTitle(e.target.value)} required />
        <input type="text" placeholder='AUTHOR OF THE BOOK' value={author} onChange={(e) => setAuthor(e.target.value)} required />
        <textarea placeholder='DESCRIPTION ABOUT THE BOOK' value={description} onChange={(e) => setDescription(e.target.value)} required />
        <input type="number" placeholder='PRICE OF THE BOOK' value={price} onChange={(e) => setPrice(e.target.value)} required />
        <input type="url" placeholder='PASTE IMAGE URL OF BOOK' value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} required />
        <select value={category} onChange={(e) => setCategory(e.target.value)} required>
          <option value="">SELECT CATEGORY</option>
          {categories.map((cat, index) => (
            <option key={index} value={cat}>{cat}</option>
          ))}
        </select>
        <button type="submit">Add Book</button>
      </form>
    </div>
  );
};

export default AdminPage;
