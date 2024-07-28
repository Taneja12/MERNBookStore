import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchUserDetails, OrderCreation } from '../services/api';
import { Button } from 'react-bootstrap';

const PaymentComponent = ({ userId, cartItems, totalAmount, setSessionId, setUserDetails }) => {
  const [userEmail, setUserEmail] = useState(null);
  const [userPhone, setUserPhone] = useState(null);
  const [userName, setUserName] = useState(null);
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
      const { sessionId } = response;
      setSessionId(sessionId);

      const userDetails = {
        customerName: userName,
        customerEmail: userEmail,
        customerPhone: userPhone,
      };
      setUserDetails(userDetails);

    } catch (error) {
      console.error('Error creating order:', error);
    }
  };

  return (
    <Button 
      variant="primary" 
      onClick={handlePayment} 
      className="btn-block" 
      style={{textTransform : "none" }}
    >
      Buy Now
    </Button>
  );
};

export default PaymentComponent;
