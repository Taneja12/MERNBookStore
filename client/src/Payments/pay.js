import cashfree from "./utils";

const pay = async (paymentSessionId) => {
  const checkoutOptions = {
    paymentSessionId: paymentSessionId,
    returnUrl: "https://mern-book-store-ajdb-frontend-deepanshu-tanejas-projects.vercel.app/payment-return",
  };

  try {
    const result = await cashfree.checkout(checkoutOptions);

    // Log the full result to see its structure
    console.log('Cashfree Checkout Result:', result);

    if (result.error) {
      alert(result.error.message);
      throw new Error(result.error.message);
    }

    if (result.redirect) {
      // Inspect the result object to locate the redirect URL
      console.log('Full Result:', result);

      // Assuming URL is in result.redirect.url or similar
      const redirectUrl = result.redirect.url;

      if (redirectUrl) {
        try {
          const url = new URL(redirectUrl);
          const transactionId = url.searchParams.get('transactionId');
          
          if (transactionId) {
            console.log("Transaction ID:", transactionId);
            localStorage.setItem('transactionId', transactionId);
          } else {
            console.error('Transaction ID not found in the redirect URL.');
          }

          window.location.href = redirectUrl;
        } catch (urlError) {
          console.error('Invalid URL:', urlError);
          alert('The redirect URL is invalid.');
          // Fallback to a default URL or handle it appropriately
          window.location.href = 'https://your-default-url.com';
        }
      } else {
        console.error('Redirect URL is missing.');
        alert('Redirect URL is missing.');
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
