import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { processPaymentReturn } from '../services/api'; // Adjust the path if needed

const PaymentReturn = () => {
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const transactionId = queryParams.get('transactionId');
    const orderId = queryParams.get('orderId');
    const paymentStatus = queryParams.get('paymentStatus');

    if (transactionId && orderId) {
      console.log("Transaction ID:", transactionId);
      console.log("Order ID:", orderId);
      console.log("Payment Status:", paymentStatus);

      // Send the details to your backend using the API service
      processPaymentReturn({
        transactionId,
        orderId,
        paymentStatus
      })
      .then(response => {
        console.log('Payment return processed:', response);
      })
      .catch(error => {
        console.error('Error processing payment return:', error);
      });
    } else {
      console.log("Transaction ID or Order ID not found in the query parameters");
    }
  }, [location]);

  return (
    <div>
      <h1>Payment Return</h1>
      <p>Processing payment...</p>
    </div>
  );
};

export default PaymentReturn;
