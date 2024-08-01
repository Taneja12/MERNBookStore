import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const PaymentReturn = () => {
  const location = useLocation();
  const [transactionId, setTransactionId] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [orderId, setOrderId] = useState(null);

  useEffect(() => {
    // Log the entire location object to inspect its structure
    console.log("Location Object:", location);

    // Parse query parameters
    const queryParams = new URLSearchParams(location.search);
    const transactionId = queryParams.get('transactionId');
    const orderId = queryParams.get('orderId');
    const paymentStatus = queryParams.get('paymentStatus');

    if (transactionId) {
      console.log("Transaction ID:", transactionId);
      setTransactionId(transactionId);
    } else {
      console.log("Transaction ID not found in the query parameters");
    }

    if (orderId) {
      console.log("Order ID:", orderId);
      setOrderId(orderId);
    }

    if (paymentStatus) {
      console.log("Payment Status:", paymentStatus);
      setPaymentStatus(paymentStatus);
    }
  }, [location]);

  return (
    <div>
      <h1>Payment Return</h1>
      {transactionId ? (
        <div>
          <p><strong>Transaction ID:</strong> {transactionId}</p>
          <p><strong>Order ID:</strong> {orderId}</p>
          <p><strong>Payment Status:</strong> {paymentStatus}</p>
        </div>
      ) : (
        <p>Transaction details not available.</p>
      )}
    </div>
  );
};

export default PaymentReturn;
