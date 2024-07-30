import cashfree from "./utils";

const pay = async (paymentSessionId) => {
  let checkoutOptions = {
    paymentSessionId: paymentSessionId,
    returnUrl: "https://mern-book-store-ajdb-frontend-deepanshu-tanejas-projects.vercel.app/payment-return",
  };

  try {
    const result = await cashfree.checkout(checkoutOptions);

    if (result.error) {
      alert(result.error.message);
      throw new Error(result.error.message); // Ensure the error is propagated
    }

    if (result.redirect) {
      // Assuming the redirect result includes the transaction ID in the URL
      const url = new URL(result.redirect.url);
      const transactionId = url.searchParams.get('transactionId');
      
      if (transactionId) {
        console.log("Transaction ID:", transactionId);
        // Here, you might want to save the transaction ID or handle it further
        // For instance, store it in localStorage or handle it in your state
        localStorage.setItem('transactionId', transactionId);
      } else {
        console.error('Transaction ID not found in the redirect URL.');
      }

      // Redirect to the provided URL
      window.location.href = result.redirect.url;
    }

    return result; // Return the result from Cashfree checkout

  } catch (error) {
    console.error('Error processing payment:', error);
    alert('Payment failed. Please try again later.');
    throw error; // Propagate the error further
  }
};

export default pay;
