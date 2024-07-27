// src/components/AdminDashboard.js
import React, { useEffect, useState } from 'react';
import { fetchBooks, fetchAllUsers, fetchAllOrders, fetchContactMessages } from '../services/api';
import Book from './Book';
import OrderSection from './OrderSection';
import OrderChart from './OrderChart'; // Import the new OrderChart component
import ContactMessages from '../components/Contact'; // Import the new ContactMessages component
import '../css/AdminDashboard.css';

function AdminDashboard() {
  const [books, setBooks] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [contacts, setContacts] = useState([]); // Add state for contacts
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState('books');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const booksData = await fetchBooks();
        const usersData = await fetchAllUsers();
        const ordersData = await fetchAllOrders();
        const contactsData = await fetchContactMessages(); // Fetch contact messages

        setBooks(booksData.books || booksData);
        setUsers(usersData);
        setOrders(ordersData);
        setContacts(contactsData); // Set contacts data
      } catch (error) {
        setError('Error fetching data');
        console.error('Error fetching admin dashboard data:', error);
      }
    };

    fetchData();
  }, []);

  const renderContent = () => {
    switch (activeSection) {
      case 'books':
        return (
          <div className="section">
            <h2>Books</h2>
            {Array.isArray(books) && books.length > 0 ? (
              <div className="books-container">
                {books.map((book) => (
                  <Book key={book._id} book={book} />
                ))}
              </div>
            ) : (
              <p>No books available</p>
            )}
          </div>
        );
      case 'users':
        return (
          <div className="section">
            <h2>Users</h2>
            {Array.isArray(users) && users.length > 0 ? (
              <ul className="user-list">
                {users.filter(user => user.role !== 'admin').map((user) => ( // Filter out admin users
                  <li key={user._id} className="user-item">
                    <div className="user-details">
                      <h3>{user.username}</h3>
                      <p>Email: {user.email}</p>
                      <p>Phone: {user.phone}</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No users available</p>
            )}
          </div>
        );
      case 'orders':
        return (
          <div className="section">
            <OrderChart orders={orders} /> {/* Use the OrderChart component */}
            <OrderSection orders={orders} />
          </div>
        );
      case 'contacts': // Add a new case for contacts
        return (
          <div className="section">
            <ContactMessages contacts={contacts} />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="admin-dashboard">
      {error && <div className="error-message">{error}</div>}

      <div className="navigation">
        <button
          onClick={() => setActiveSection('books')}
          className={activeSection === 'books' ? 'active' : ''}
        >
          Books
        </button>
        <button
          onClick={() => setActiveSection('users')}
          className={activeSection === 'users' ? 'active' : ''}
        >
          Users
        </button>
        <button
          onClick={() => setActiveSection('orders')}
          className={activeSection === 'orders' ? 'active' : ''}
        >
          Orders
        </button>
        <button
          onClick={() => setActiveSection('contacts')}
          className={activeSection === 'contacts' ? 'active' : ''}
        >
          Contacts
        </button>
      </div>

      {renderContent()}
    </div>
  );
}

export default AdminDashboard;
