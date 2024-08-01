import React, { useState, useEffect } from 'react';
import { fetchCartItems, removeCartItem, createOrder } from '../services/api'; // Adjust API functions
import PaymentComponent from '../components/PaymentComponent'; // Adjust path
import '../css/Cart.css';
import pay from '../Payments/pay'; // Payment handling function

const Cart = ({ userId }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [orderId, setOrderId] = useState(null);
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    const getCartItems = async () => {
      try {
        const items = await fetchCartItems(userId);
        setCartItems(items);
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setCartItems([]);
        } else {
          console.error('Error fetching cart items:', err);
          setError('Error fetching cart items');
        }
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      getCartItems();
    }
  }, [userId]);

  const handleRemoveItem = async (bookId) => {
    try {
      await removeCartItem(userId, bookId);
      const updatedItems = cartItems.filter(item => item.bookId !== bookId);
      setCartItems(updatedItems);
    } catch (err) {
      console.error('Error removing item from cart:', err);
    }
  };

  const calculateTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.bookPrice * item.quantity, 0);
  };

  const handlePayment = async () => {
    try {
      await pay(sessionId); // Assume this handles payment processing
      setPaymentStatus('Payment successful');

      // Create order after successful payment
      await createOrder(sessionId, userId, cartItems, orderId);

      // Remove items from the cart after successful order placement
      await Promise.all(
        cartItems.map(async (item) => {
          await removeCartItem(userId, item.bookId);
        })
      );

      // Clear the cart state
      setCartItems([]);
    } catch (error) {
      console.error('Error processing payment:', error);
      setPaymentStatus('Payment failed');
    }
  };

  const handleSetUserDetails = (details) => {
    setUserDetails(details);
  };

  if (loading) return <p>Loading cart items...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="cart">
      <h2>Your Cart</h2>
      {cartItems.length === 0 ? (
        <p className="empty-cart-message">Your cart is empty.</p>
      ) : (
        <>
          <ul>
            {cartItems.map(item => (
              <li key={item.bookId} className="cart-item">
                <div className="cart-item-details">
                  <img src={item.bookImage} alt={item.bookTitle} className="cart-item-image" />
                  <div>
                    <h3>{item.bookTitle}</h3>
                    <p>Quantity: {item.quantity}</p>
                    <p>Price: ₹ {item.bookPrice.toFixed(2)}</p>
                  </div>
                </div>
                <button onClick={() => handleRemoveItem(item.bookId)} className="remove-item-button">
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <div className="cart-summary">
            <h3>Total Price: ₹ {calculateTotalPrice().toFixed(2)}</h3>
            {userDetails && (
              <div className="user-details-box">
                <h3>User Details:</h3>
                <p>Username: {userDetails.customerName}</p>
                <p>Email: {userDetails.customerEmail}</p>
                <p>Phone: {userDetails.customerPhone}</p>
              </div>
            )}
            {paymentStatus && <p>{paymentStatus}</p>}
            <div className="buy-now-container">
              {sessionId ? (
                <button className="buy-now-button" onClick={handlePayment}>
                  Proceed to Payment
                </button>
              ) : (
                <PaymentComponent
                  userId={userId}
                  cartItems={cartItems}
                  totalAmount={calculateTotalPrice()}
                  setSessionId={setSessionId}
                  setOrderId={setOrderId}
                  setUserDetails={handleSetUserDetails}
                />
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
