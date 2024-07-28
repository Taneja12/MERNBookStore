// AddToCartButton.js
import React from 'react';
import { addToCart } from '../services/api';
import { Button } from 'react-bootstrap';

function AddToCartButton({ userId, bookId, quantity, onSuccess, onError, onClick }) {
  const handleAddToCart = async () => {
    if (onClick) onClick();

    try {
      await addToCart(userId, bookId, quantity);
      if (onSuccess) onSuccess();
    } catch (error) {
      if (onError) onError(error);
    }
  };

  return (
    <Button variant="secondary" onClick={handleAddToCart} className="btn-block">
      Add to Cart
    </Button>
  );
}

export default AddToCartButton;
