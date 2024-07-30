// PaymentReturn.js
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const PaymentReturn = () => {
  const location = useLocation();

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
      // Process the transaction ID as needed
    } else {
      console.log("Transaction ID not found in the query parameters");
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
