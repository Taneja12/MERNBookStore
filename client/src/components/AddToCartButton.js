// components/AddToCartButton.js

import React from 'react';
import { addToCart } from '../services/api';
import { Button } from 'react-bootstrap';

const AddToCartButton = ({ userId, bookId, quantity, onSuccess, onError, onClick }) => {
  const handleAddToCart = async () => {
    try {
      const cartItem = await addToCart(userId, bookId, quantity);
      onSuccess(cartItem);
    } catch (error) {
      onError(error);
    }
  };

  return (
    <Button
      variant="secondary"
      className="btn-block"
      onClick={onClick || handleAddToCart}
    >
      Add to Cart
    </Button>
  );
};

export default AddToCartButton;
