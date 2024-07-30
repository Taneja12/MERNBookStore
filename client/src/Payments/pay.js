// pay.js
import cashfree from "./utils";

const pay = (paymentSessionId) => {
  let checkoutOptions = {
    paymentSessionId: paymentSessionId,
    returnUrl: "https://mern-book-store-ajdb-frontend-deepanshu-tanejas-projects.vercel.app/payment-return",
  };

  return cashfree.checkout(checkoutOptions)
    .then(function(result) {
      if (result.error) {
        alert(result.error.message);
      }
      if (result.redirect) {
        console.log("Redirection");
      }
      return result; // Return the result from Cashfree checkout
    })
    .catch(function(error) {
      console.error('Error processing payment:', error);
      alert('Payment failed. Please try again later.');
      throw error; // Propagate the error further
    });
};

export default pay;
