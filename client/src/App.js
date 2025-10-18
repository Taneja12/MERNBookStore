import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import LoginForm from './components/LoginForm';
import Home from './pages/Home';
import AdminPage from './components/Admin';
import CustomNavbar from './components/Navbar';
import About from './components/About';
import SearchResults from './components/SearchResults';
import BookDetails from './components/BookDetails';
import RegisterForm from './components/RegisterForm';
import CategoryPage from './pages/CategoryPage';
import PaymentComponent from './components/PaymentComponent';
import UserProfile from './components/Usercomponent';
import Cart from './components/Cart';
import OrderList from './components/OrderList';
import AdminDashboard from './components/AdminDashboard';
import ContactUs from './components/ContactUs'; 
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import Footer from './components/Footer';
import EnterField from './components/EnterField';
import { fetchUserDetails } from './services/api';
import { jwtDecode } from 'jwt-decode';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (function() {
      const s1 = document.createElement("script");
      const s0 = document.getElementsByTagName("script")[0];
      s1.async = true;
      s1.src = "https://embed.tawk.to/68f3a37193c95d194f3a02f3/1j7rrcto6";
      s1.charset = "UTF-8";
      s1.setAttribute("crossorigin", "*");
      s0.parentNode.insertBefore(s1, s0);
    })();
  }, []);

  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const decoded = jwtDecode(token);
          const currentTime = Date.now() / 1000;

          if (decoded.exp < currentTime) {
            handleLogout();
          } else {
            setIsAuthenticated(true);
            setUserId(decoded.userId);
            const user = await fetchUserDetails();
            if (user.role === 'admin') setIsAdmin(true);
          }
        } catch (error) {
          console.error('Error decoding token:', error);
          handleLogout();
        }
      }
      setLoading(false);
    };

    checkToken();
  }, []);

  const handleLogout = () => {
    setIsAuthenticated(false);
    setIsAdmin(false);
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    window.location.href = '/';
  };

  if (loading) return <div>Loading...</div>;

  return (
    <AuthProvider>
      <Router>
        <CustomNavbar isAuthenticated={isAuthenticated} isAdmin={isAdmin} handleLogout={handleLogout} />
        <div style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/register" element={isAuthenticated ? <Navigate to="/" /> : <RegisterForm setIsAuthenticated={setIsAuthenticated} />} />
            <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <LoginForm setIsAuthenticated={setIsAuthenticated} />} />
            <Route path="/addbook" element={isAuthenticated && isAdmin ? <AdminPage /> : <Navigate to="/login" />} />
            <Route path="/book/:id" element={<BookDetails userId={userId} />} />
            <Route path="/category/:categoryName" element={<CategoryPage />} />
            <Route path="/payment" element={<PaymentComponent />} />
            <Route path="/user" element={<UserProfile />} />
            <Route path="/enter-phone" element={<EnterField />} />
            <Route path="/cart" element={<Cart userId={userId} />} />
            <Route path="/orders" element={<OrderList userId={userId} />} />
            <Route path="/admin" element={isAuthenticated && isAdmin ? <AdminDashboard /> : <Navigate to="/login" />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/forgot-password" element={isAuthenticated ? <Navigate to="/" /> : <ForgotPassword />} />
            <Route path="/reset-password/:token" element={isAuthenticated ? <Navigate to="/" /> : <ResetPassword />} />
          </Routes>
        </div>
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;
