import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faBars, faTimes, faUserCircle, faClipboardList, faCartShopping, faPlus } from '@fortawesome/free-solid-svg-icons';
import '../css/Navbar.css';

function Navbar({ isAuthenticated, isAdmin, handleLogout }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    if (searchQuery.trim() !== '') {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const categories = [
    { id: 1, name: 'Fiction' },
    { id: 2, name: 'AutoBiography' },
    { id: 3, name: 'Business' },
    { id: 4, name: 'Crime' },
    { id: 5, name: 'History' },
    { id: 6, name: 'Romance' },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/" className="navbar-logo">
          <img
            src="https://qwicky.pythonanywhere.com/media/images/DT1.png"
            alt="Logo"
            className="logo-image"
          />
        </Link>
      </div>
      <div className={`navbar-links ${menuOpen ? 'active' : ''}`}>
        <ul className="navbar-nav">
          <li className="nav-item">
            <Link
              to="/"
              className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/about"
              className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              About
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/contact"
              className={`nav-link ${location.pathname === '/contact' ? 'active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              Contact
            </Link>
          </li>
          <li className="nav-item dropdown">
            <div className="nav-link dropdown-toggle">Categories</div>
            <ul className="dropdown-menu">
              {categories.map((category) => (
                <li key={category.id}>
                  <Link
                    to={`/category/${category.name}`}
                    className={`dropdown-link ${location.pathname === `/category/${category.name}` ? 'active' : ''}`}
                    onClick={() => setMenuOpen(false)}
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </li>
          {isAuthenticated ? (
            <li className="nav-item dropdown">
              <div className="nav-link dropdown-toggle">
                <FontAwesomeIcon icon={faUserCircle} className="mr-2" />
              </div>
              <ul className="dropdown-menu">
                <li>
                  <Link
                    to="/user"
                    className={`dropdown-link ${location.pathname === '/user' ? 'active' : ''}`}
                    onClick={() => setMenuOpen(false)}
                  >
                    <FontAwesomeIcon icon={faUserCircle} className="mr-2" />
                    Profile
                  </Link>
                </li>
                <li>
                  <Link
                    to="/cart"
                    className={`dropdown-link ${location.pathname === '/cart' ? 'active' : ''}`}
                    onClick={() => setMenuOpen(false)}
                  >
                    <FontAwesomeIcon icon={faCartShopping} className="mr-2" />
                    Cart
                  </Link>
                </li>
                <li>
                  <Link
                    to="/your-orders"
                    className={`dropdown-link ${location.pathname === '/your-orders' ? 'active' : ''}`}
                    onClick={() => setMenuOpen(false)}
                  >
                    <FontAwesomeIcon icon={faClipboardList} className="mr-2" />
                    Your Orders
                  </Link>
                </li>
                {isAdmin && (
                  <li>
                    <Link
                      to="/addbook"
                      className={`dropdown-link ${location.pathname === '/addbook' ? 'active' : ''}`}
                      onClick={() => setMenuOpen(false)}
                    >
                      <FontAwesomeIcon icon={faPlus} className="mr-2" />
                      Add Books
                    </Link>
                  </li>
                )}
                {isAdmin && (
                  <li>
                    <Link
                      to="/admin"
                      className={`dropdown-link ${location.pathname === '/admin' ? 'active' : ''}`}
                      onClick={() => setMenuOpen(false)}
                    >
                      <FontAwesomeIcon icon={faClipboardList} className="mr-2" />
                      Admin Dashboard
                    </Link>
                  </li>
                )}
                <li>
                  <div
                    className="dropdown-link"
                    onClick={() => {
                      handleLogout();
                      setMenuOpen(false);
                    }}
                  >
                    <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                    Logout
                  </div>
                </li>
              </ul>
            </li>
          ) : (
            <li className="nav-item">
              <Link to="/login" className={`nav-link ${location.pathname === '/login' ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>
                Login
              </Link>
            </li>
          )}
        </ul>
      </div>
      <div className="search-container">
        <form onSubmit={handleSearchSubmit} className="search-form">
          <input
            type="text"
            placeholder="Search books..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="search-input"
          />
          <button type="submit" className="search-button">
            Search
          </button>
        </form>
      </div>
      <div className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
        <FontAwesomeIcon icon={menuOpen ? faTimes : faBars} />
      </div>
    </nav>
  );
}

export default Navbar;
