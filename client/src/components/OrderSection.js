import React from 'react';

const OrderSection = ({ orders }) => {
  return (
    <div className="section">
      <h2 style={{color:"black"}}>Orders</h2>
      {Array.isArray(orders) && orders.length > 0 ? (
        <ul className="order-list">
          {orders
          .filter(order => order.transactionId)
          .map((order) => (
            <li key={order._id} className="order-item">
              <div className="order-details">
                <h3>Order ID: {order._id}</h3>
                <h3>Transaction ID: {order.transactionId}</h3>
                <p style={{color:"black"}}>Username: {order.userId?.username || 'Unknown'}</p> {/* Display user name */}
                {/* <p>Session ID: {order.sessionId}</p> */}
                <ul className="order-items">
                  {order.cartItems.map((item) => (
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
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
                <p className="order-date">
                  Order Placed: {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No orders available</p>
      )}
    </div>
  );
};

export default OrderSection;
