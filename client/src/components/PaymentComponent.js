import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchUserDetails, OrderCreation } from '../services/api';
import { Button, Spinner } from 'react-bootstrap';

const PaymentComponent = ({ userId, cartItems, totalAmount, setSessionId, setOrderId, setUserDetails }) => {
  const [userEmail, setUserEmail] = useState(null);
  const [userPhone, setUserPhone] = useState(null);
  const [userName, setUserName] = useState(null);
  const [loading, setLoading] = useState(false); // Added loading state
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const getUserDetails = async () => {
        try {
          const userDetails = await fetchUserDetails(token);
          setUserEmail(userDetails.email);
          setUserPhone(userDetails.phone);
          setUserName(userDetails.username);
        } catch (error) {
          console.error('Error fetching user details:', error);
        }
      };

      getUserDetails();
    }
  }, []);

  const handlePayment = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login', { state: { message: 'Please log in to proceed with the payment.' } });
      return;
    }

    setLoading(true); // Set loading to true when payment starts

    try {
      const orderData = {
        orderId: `order_${userId}_${Date.now()}`,
        orderAmount: totalAmount,
        customer_id: userId,
        customerName: userName,
        customerEmail: userEmail,
        customerPhone: String(userPhone),
        cartItems: cartItems.map(item => ({
          bookId: item.bookId,
          quantity: item.quantity,
          price: item.bookPrice,
        })),
      };

      const response = await OrderCreation(orderData, token);
      const { sessionId, order_id } = response;
      setSessionId(sessionId);
      setOrderId(order_id);

      const userDetails = {
        customerName: userName,
        customerEmail: userEmail,
        customerPhone: userPhone,
      };
      setUserDetails(userDetails);

    } catch (error) {
      console.error('Error creating order:', error);
    } finally {
      setLoading(false); // Set loading to false when payment is complete
    }
  };

  return (
    <Button 
      variant="primary" 
      onClick={handlePayment} 
      className="btn-block" 
      style={{ textTransform: 'none' }}
      disabled={loading} // Disable button while loading
    >
      {loading ? (
        <div className="d-flex align-items-center">
          <Spinner animation="border" size="sm" className="mr-2" />
          Processing...
        </div>
      ) : (
        'Buy Now'
      )}
    </Button>
  );
};

export default PaymentComponent;
