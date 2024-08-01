import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchBookDetails, createOrder } from '../services/api';
import pay from '../Payments/pay';
import PaymentComponent from '../components/PaymentComponent';
import AddToCartButton from '../components/AddToCartButton';
import { Container, Row, Col, Image, Form, Card, Spinner, Alert, Button, Modal } from 'react-bootstrap';
import { ClipLoader } from 'react-spinners';
import '../css/BookDetail.css';

function BookDetails({ userId }) {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [OrderId, setOrderId] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isFetchingSession, setIsFetchingSession] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Add loading state

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
    setIsProcessing(true);
    setIsLoading(true); // Start loading

    try {
      await pay(sessionId);
      setPaymentStatus('Payment successful');
      await createOrder(sessionId, userId, [{ bookId: book._id, quantity, bookPrice: book.price }], OrderId);
    } catch (error) {
      console.error('Error processing payment:', error);
      setPaymentStatus('Payment failed');
    } finally {
      setIsProcessing(false);
      setIsLoading(false); // End loading
    }
  };

  const handleSetUserDetails = (details) => {
    setUserDetails(details);
    setShowUserDetails(true);
  };

  const handlePaymentSuccess = () => {
    setPaymentStatus('Payment successful');
  };

  const handlePaymentError = () => {
    setPaymentStatus('Payment failed');
  };

  const handleAddToCartSuccess = () => {
    alert('Item added to cart successfully');
    setIsAddingToCart(false);
  };

  const handleAddToCartError = (error) => {
    console.error('Error adding to cart:', error);
    setIsAddingToCart(false);
  };

  const handleQuantityChange = (event) => {
    setQuantity(parseInt(event.target.value, 10));
  };

  const handleAddToCartClick = () => {
    setIsAddingToCart(true);
  };

  if (loading) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  const showDescription = book && book.description;
  const showReadMore = showDescription && book.description.length > 500;

  return (
    <Container className="my-4">
      <Row className="bg-dark text-white rounded p-4">
        <Col md={3} className="text-center">
          <Image src={book.imageUrl} alt={book.title} fluid rounded />
        </Col>
        <Col md={6}>
          <h2>{book.title}</h2>
          <p><strong>Author:</strong> {book.author}</p>
          <p><strong>Genre:</strong> {book.category}</p>
          <hr />
          <div className={`description ${expanded ? 'expanded' : ''}`}>
            <p>{expanded ? book.description : `${book.description.substring(0, 800)}...`}</p>
          </div>
          {showReadMore && (
            <Button variant="link" onClick={toggleDescription}>
              {expanded ? 'Read less' : 'Read more'}
            </Button>
          )}
          <p><strong>Price:</strong> ₹ {book.price}</p>
          <Form.Group as={Row} className="align-items-center">
            <Form.Label column sm="3">Quantity:</Form.Label>
            <Col sm="3">
              <Form.Control as="select" value={quantity} onChange={handleQuantityChange}>
                {[...Array(10).keys()].map((i) => (
                  <option key={i + 1} value={i + 1}>{i + 1}</option>
                ))}
              </Form.Control>
            </Col>
          </Form.Group>
        </Col>
        <Col md={3}>
          {showUserDetails && (
            <Card className="mt-4">
              <Card.Header>User Details</Card.Header>
              <Card.Body>
                <Card.Text><strong>Username:</strong> {userDetails?.customerName}</Card.Text>
                <Card.Text><strong>Email:</strong> {userDetails?.customerEmail}</Card.Text>
                <Card.Text><strong>Phone:</strong> {userDetails?.customerPhone}</Card.Text>
              </Card.Body>
            </Card>
          )}
          {paymentStatus && <Alert variant={paymentStatus === 'Payment successful' ? 'success' : 'danger'}>{paymentStatus}</Alert>}
          {isProcessing ? (
            <ClipLoader size={35} />
          ) : sessionId ? (
            <Button variant="success" onClick={handlePayment} className="btn-block mt-4">Proceed to Payment</Button>
          ) : (
            isFetchingSession ? (
              <ClipLoader size={35} className="mt-4" />
            ) : (
              <PaymentComponent
                userId={userId}
                cartItems={[{ bookId: book._id, quantity, bookPrice: book.price }]}
                totalAmount={quantity * book.price}
                setSessionId={setSessionId}
                setOrderId={setOrderId}
                setUserDetails={handleSetUserDetails}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
                className="mt-4"
              />
            )
          )}
          {/* {OrderId} */}
          <div className="mt-4">
            {isAddingToCart ? (
              <ClipLoader size={35} />
            ) : (
              <AddToCartButton
                userId={userId}
                bookId={book._id}
                quantity={quantity}
                onSuccess={handleAddToCartSuccess}
                onError={handleAddToCartError}
                className="btn btn-secondary btn-block"
                onClick={handleAddToCartClick}
              />
            )}
          </div>
        </Col>
      </Row>
      <Modal show={isLoading} backdrop="static" keyboard={false} centered>
        <Modal.Body className="text-center">
          <Spinner animation="border" />
          <p>Loading...</p>
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default BookDetails;
