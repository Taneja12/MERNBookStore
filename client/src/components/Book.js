import React from 'react';
import { Link } from 'react-router-dom';
import '../css/Book.css'; // Import your CSS file for Book styling

function Book({ book }) {
  if (!book) {
    return <p>No book data available.</p>;
  }

  const { _id, title, author, price, imageUrl } = book;

  return (
    <Link to={`/book/${_id}`} className="book-card-link">
      <div className="book-card">
        <div className="book-image-container">
          <img
            src={imageUrl}
            alt={title}
            className="book-image"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'default-image-url.jpg'; // Replace with your default image URL or placeholder
            }}
          />
          <div className="overlay">
            <div className="overlay-content">
              <h2>{title}</h2>
              {/* <p>Author: {author}</p> */}
              {/* <p>Price: {price}</p> */}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default Book;
