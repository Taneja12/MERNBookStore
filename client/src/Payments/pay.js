import cashfree from "./utils";

const pay = async (paymentSessionId) => {
  const checkoutOptions = {
    paymentSessionId: paymentSessionId,
    returnUrl: "https://mern-book-store-ajdb-frontend-deepanshu-tanejas-projects.vercel.app/payment-return",
  };

  try {
    const result = await cashfree.checkout(checkoutOptions);

    // Debug the full result
    console.log('Cashfree Checkout Result:', result);

    if (result.error) {
      alert(result.error.message);
      throw new Error(result.error.message);
    }

    if (result.redirect) {
      // Validate the redirect URL
      const redirectUrl = result.redirect.url;
      console.log('Redirect URL:', redirectUrl);

      try {
        // Ensure the redirect URL is valid
        const url = new URL(redirectUrl);
        const transactionId = url.searchParams.get('transactionId');
        
        if (transactionId) {
          console.log("Transaction ID:", transactionId);
          localStorage.setItem('transactionId', transactionId);
        } else {
          console.error('Transaction ID not found in the redirect URL.');
        }

        // Redirect to the provided URL
        window.location.href = redirectUrl;
      } catch (urlError) {
        console.error('Invalid URL:', urlError);
        alert('The redirect URL is invalid.');
      }
    }

    return result;

  } catch (error) {
    console.error('Error processing payment:', error);
    alert('Payment failed. Please try again later.');
    throw error;
  }
};

export default pay;
