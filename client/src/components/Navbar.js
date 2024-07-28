import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Navbar, Nav, NavDropdown, Form, FormControl, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faUserCircle, faClipboardList, faCartShopping, faPlus } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/Navbar.css';

function CustomNavbar({ isAuthenticated, isAdmin, handleLogout }) {
  const [searchQuery, setSearchQuery] = useState('');
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
    <Navbar expand="lg" className="custom-navbar">
      <Navbar.Brand as={Link} to="/">
        <img
          src="https://qwicky.pythonanywhere.com/media/images/DT1.png"
          alt="Logo"
          className="logo-image"
        />
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link as={Link} to="/" active={location.pathname === '/'}>Home</Nav.Link>
          <Nav.Link as={Link} to="/about" active={location.pathname === '/about'}>About</Nav.Link>
          <Nav.Link as={Link} to="/contact" active={location.pathname === '/contact'}>Contact</Nav.Link>
          <NavDropdown title="Categories" id="basic-nav-dropdown">
            {categories.map((category) => (
              <NavDropdown.Item
                key={category.id}
                as={Link}
                to={`/category/${category.name}`}
                active={location.pathname === `/category/${category.name}`}
              >
                {category.name}
              </NavDropdown.Item>
            ))}
          </NavDropdown>
        </Nav>
        <Form className="d-inline-flex search-form" onSubmit={handleSearchSubmit}>
          <FormControl
            type="text"
            placeholder="Search books..."
            className="mr-sm-2"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <Button variant="outline-light" type="submit">Search</Button>
        </Form>
        {isAuthenticated ? (
          <Nav>
            <NavDropdown title={<FontAwesomeIcon icon={faUserCircle} />} id="user-nav-dropdown">
              <NavDropdown.Item as={Link} to="/user" active={location.pathname === '/user'}>
                <FontAwesomeIcon icon={faUserCircle} className="dropdown-icon" />Profile
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/cart" active={location.pathname === '/cart'}>
                <FontAwesomeIcon icon={faCartShopping} className="dropdown-icon" />Cart
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/orders" active={location.pathname === '/your-orders'}>
                <FontAwesomeIcon icon={faClipboardList} className="dropdown-icon" />Your Orders
              </NavDropdown.Item>
              {isAdmin && (
                <>
                  <NavDropdown.Item as={Link} to="/addbook" active={location.pathname === '/addbook'}>
                    <FontAwesomeIcon icon={faPlus} className="dropdown-icon" />Add Books
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/admin" active={location.pathname === '/admin'}>
                    <FontAwesomeIcon icon={faClipboardList} className="dropdown-icon" />Admin Dashboard
                  </NavDropdown.Item>
                </>
              )}
              <NavDropdown.Item onClick={handleLogout}>
                <FontAwesomeIcon icon={faSignOutAlt} className="dropdown-icon" />Logout
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        ) : (
          <Nav>
            <Nav.Link as={Link} to="/login" active={location.pathname === '/login'}>Login</Nav.Link>
          </Nav>
        )}
      </Navbar.Collapse>
    </Navbar>
  );
}

export default CustomNavbar;
