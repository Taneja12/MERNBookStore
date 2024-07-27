import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchBookDetails, createOrder } from '../services/api';
import '../css/BookDetail.css'; // Assuming you've added the styles here
import pay from '../Payments/pay';
import PaymentComponent from '../components/PaymentComponent';
import AddToCartButton from '../components/AddToCartButton';

function BookDetails({ userId }) {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const data = await fetchBookDetails(id);
        setBook(data);
      } catch (error) {
        console.error('Error fetching book details:', error);
        setError('Error fetching book details');
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  const toggleDescription = () => {
    setExpanded(!expanded);
  };

  const handlePayment = async () => {
    try {
      await pay(sessionId);
      setPaymentStatus('Payment successful');
      await createOrder(sessionId, userId, [{ bookId: book._id, quantity, bookPrice: book.price }]);
    } catch (error) {
      console.error('Error processing payment:', error);
      setPaymentStatus('Payment failed');
    }
  };

  const handleSetUserDetails = (details) => {
    setUserDetails(details);
  };

  const handlePaymentSuccess = () => {
    setPaymentStatus('Payment successful');
    // Implement further actions upon successful payment if needed
  };

  const handlePaymentError = () => {
    setPaymentStatus('Payment failed');
    // Implement error handling if needed
  };

  const handleAddToCartSuccess = () => {
    // Implement any UI update or notification on success
    alert('Item added to cart successfully');
  };

  const handleAddToCartError = (error) => {
    console.error('Error adding to cart:', error);
    // Implement error handling or notification
  };

  const handleQuantityChange = (event) => {
    setQuantity(parseInt(event.target.value, 10));
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  const showDescription = book && book.description;
  const showReadMore = showDescription && book.description.length > 800;

  return (
    <>
      <div className="background-image"></div>
      <div className={`book-details ${expanded ? 'expanded' : ''}`}>
        <div className="book-details-image">
          <img src={book.imageUrl} alt={book.title} />
        </div>
        <div className="book-details-content">
          <h2>{book.title}</h2>
          <div className="author-genre-row">
            <p className="author">Author: {book.author}</p>
            <p className="genre">Genre: {book.category}</p>
          </div>
          <hr />
          <div className={`description ${expanded ? 'expanded' : ''}`}>
            <p>{book.description}</p>
          </div>
          {showReadMore && (
            <p className="read-more-link" onClick={toggleDescription}>
              {expanded ? 'Read less' : 'Read more'}
            </p>
          )}
          <p>Price: ₹ {book.price}</p>
          <div className="quantity-add-to-cart-container">
            <div className="quantity-input">
              <label htmlFor="quantity">Quantity:</label>
              <select id="quantity" name="quantity" value={quantity} onChange={handleQuantityChange}>
                {[...Array(10).keys()].map((i) => (
                  <option key={i + 1} value={i + 1}>{i + 1}</option>
                ))}
              </select>
            </div>
            <AddToCartButton
              userId={userId}
              bookId={book._id}
              quantity={quantity}
              onSuccess={handleAddToCartSuccess}
              onError={handleAddToCartError}
              className="add-to-cart-button"
            />
          </div>
        </div>
        <div className="buy-button-container">
          {userDetails && (
            <div className="user-details-box">
              <h3>User Details:</h3>
              <p>Username: {userDetails.customerName}</p>
              <p>Email: {userDetails.customerEmail}</p>
              <p>Phone: {userDetails.customerPhone}</p>
            </div>
          )}
          {paymentStatus && <p className="payment-status">{paymentStatus}</p>}

          <div className="buy-card">
            {sessionId ? (
              <button className="buy-button" onClick={handlePayment}>
                Proceed to Payment
              </button>
            ) : (
              <PaymentComponent
                userId={userId}
                cartItems={[{ bookId: book._id, quantity, bookPrice: book.price }]}
                totalAmount={quantity * book.price}
                setSessionId={setSessionId}
                setUserDetails={handleSetUserDetails}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default BookDetails;
