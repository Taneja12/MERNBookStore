// components/AddToCartButton.js

import React from 'react';
import { addToCart } from '../services/api';

const AddToCartButton = ({ userId, bookId, quantity, onSuccess, onError }) => {
  const handleAddToCart = async () => {
    try {
      const cartItem = await addToCart(userId, bookId, quantity);
      onSuccess(cartItem);
    } catch (error) {
      onError(error);
    }
  };

  return (
    <button className="add-to-cart-button" onClick={handleAddToCart}>
      Add to Cart
    </button>
  );
};

export default AddToCartButton;
