import React, { useState, useEffect } from 'react';
import { fetchOrders } from '../services/api'; // Adjust API functions
import '../css/OrderList.css'; // Example CSS file for styling

const OrderList = ({ userId }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getOrders = async () => {
      try {
        const data = await fetchOrders(userId);
        setOrders(data);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setError('Error fetching orders');
      } finally {
        setLoading(false);
      }
    };

    getOrders();
  }, [userId]);

  if (loading) return <p>Loading orders...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="order-list">
      <h2>Your Orders</h2>
      {orders.length === 0 ? (
        <p style={{color:"black"}}>No orders found.</p>
      ) : (
        <ul className="orders">
          {orders
            .filter(order => order.transactionId) // Only display orders with a transactionId
            .map(order => (
              <li key={order._id} className="order-item">
                <div className="order-details">
                  <h3>Transaction ID: {order.transactionId}</h3>
                  <ul className="order-items">
                    {order.cartItems.map(item => (
                      <li key={item.bookId._id} className="order-item-details">
                        <div className="item-details">
                          <div className="item-image">
                            <img
                              src={item.bookId.imageUrl}
                              alt={item.bookId.title}
                              className="book-image1"
                            />
                          </div>
                          <div className="item-info">
                            <p className="book-title">{item.bookId.title}</p>
                            <p>Quantity: {item.quantity}</p>
                            <p>Payment Status: {order.paymentStatus}</p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <p className="order-date">Order Placed: {new Date(order.createdAt).toLocaleString()}</p>
                </div>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
};

export default OrderList;
