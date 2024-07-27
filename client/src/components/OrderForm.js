// client/src/components/OrderForm.js
import React, { useState } from 'react';
import axios from 'axios';

const OrderForm = () => {
  const [orderDetails, setOrderDetails] = useState({
    customer_id: '7632', // Replace with dynamic data as needed
    customer_phone: '9999999999', // Replace with dynamic data as needed
    order_amount: 1500, // Replace with dynamic data as needed
    order_currency: 'INR'
  });

  const [paymentSessionId, setPaymentSessionId] = useState('');

  const createOrder = async () => {
    try {
      const response = await axios.post('/api/orders/create-order', orderDetails);
      const { paymentSessionId } = response.data.order; // Assuming Cashfree API response structure
      setPaymentSessionId(paymentSessionId);
    } catch (error) {
      console.error('Error creating order:', error);
    }
  };

  return (
    <div>
      <h2>Create Order Form</h2>
      <button onClick={createOrder}>Create Order</button>
      {paymentSessionId && <p>Payment Session ID: {paymentSessionId}</p>}
    </div>
  );
};

export default OrderForm;
