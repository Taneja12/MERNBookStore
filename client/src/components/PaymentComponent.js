import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { fetchUserDetails } from '../services/api'; // Import the fetchUserDetails function

const PaymentComponent = ({ userId, cartItems, totalAmount, setSessionId, setUserDetails }) => {
  const [userEmail, setUserEmail] = useState(null);
  const [userPhone, setUserPhone] = useState(null);
  const [userName, setUserName] = useState(null);

  useEffect(() => {
    const getUserDetails = async () => {
      try {
        const userDetails = await fetchUserDetails();
        setUserEmail(userDetails.email);
        setUserPhone(userDetails.phone);
        setUserName(userDetails.username);
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    getUserDetails();
  }, []);

  const handlePayment = async () => {
    try {
      const token = localStorage.getItem('token');
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

      const response = await axios.post('http://localhost:5000/api/orders/createOrder', orderData, {
        headers: {
          Authorization: `Bearer ${token}`, // Ensure Bearer token format
          'Content-Type': 'application/json',
          'x-api-version': '2023-08-01',
        },
      });

      const { sessionId } = response.data;
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
    <div>
      <button onClick={handlePayment}>
        Buy Now
      </button>
    </div>
  );
};

export default PaymentComponent;
