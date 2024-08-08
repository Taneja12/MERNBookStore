import React, { useEffect, useState } from 'react';
import { fetchBooks, fetchAllUsers, fetchAllOrders, fetchContactMessages } from '../services/api'; 
import Book from './Book';
import OrderSection from './OrderSection';
import OrderChart from './OrderChart'; 
import ContactMessages from '../components/Contact'; 
import AdminPage from './Admin'; 
import '../css/AdminDashboard.css';

function AdminDashboard() {
  const [books, setBooks] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [contacts, setContacts] = useState([]); 
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState('books');
  const [showAddBookForm, setShowAddBookForm] = useState(false); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const booksData = await fetchBooks();
        const usersData = await fetchAllUsers();
        const ordersData = await fetchAllOrders();
        const contactsData = await fetchContactMessages(); 

        setBooks(booksData.books || booksData);
        setUsers(usersData);
        setOrders(ordersData);
        setContacts(contactsData); 
      } catch (error) {
        setError('Error fetching data');
        console.error('Error fetching admin dashboard data:', error);
      }
    };

    fetchData();
  }, []);

  const handleAddBook = async () => {
    try {
      const booksData = await fetchBooks(); 
      setBooks(booksData.books || booksData);
      setShowAddBookForm(false); // Hide the Add Book form after adding a book
    } catch (error) {
      setError('Error fetching books');
      console.error('Error fetching books after adding a new book:', error);
    }
  };

  const toggleAddBookForm = () => {
    setShowAddBookForm(prevState => !prevState); // Toggle the form visibility
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'books':
        return (
          <div className="section">
            <h2 style={{color:"black"}}>Books</h2>
            <button onClick={toggleAddBookForm} className="add-book-button">
              {showAddBookForm ? 'Close Form' : 'Add New Book'}
            </button>
            {showAddBookForm && (
              <AdminPage onAdd={handleAddBook} />
            )}
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
            <h2 style={{color:"black"}}>Users</h2>
            {Array.isArray(users) && users.length > 0 ? (
              <ul className="user-list">
                {users.filter(user => user.role !== 'admin').map((user) => (
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
            <OrderChart orders={orders} />
            <OrderSection orders={orders} />
          </div>
        );
      case 'contacts':
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
