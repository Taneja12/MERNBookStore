// client/services/api.js

import axios from 'axios';

const BASE_URL = 'https://mern-book-store-gilt.vercel.app/'; // Adjust port if necessary

export const fetchBooks = async ({ page = 1, pageSize = 10 } = {}) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/books`, {
      params: { page, pageSize }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching books:', error);
    throw error; // Optional: Rethrow or handle the error as needed
  }
};


export const fetchBookDetails = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/books/${id}`);
    return response.data; // Assuming your API returns book details as JSON
  } catch (error) {
    console.error(`Error fetching book with ID ${id}:`, error);
    throw error; // Optional: Rethrow or handle the error as needed
  }
};


export const searchBooksByTitle = async (title) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/books/search?title=${title}`);
    return response.data; // Assuming your API returns search results as JSON
  } catch (error) {
    console.error(`Error searching books with title ${title}:`, error);
    throw error; // Optional: Rethrow or handle the error as needed
  }
};


export const fetchBooksByCategory = async (category) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/category/${category}`);
    return response.data; // Assuming your API returns books filtered by category
  } catch (error) {
    console.error(`Error fetching books by category ${category}:`, error);
    throw error;
  }
};


export const fetchUserDetails = async () => {
  const token = localStorage.getItem('token');

  if (!token) {
    throw new Error('No token found');
  }

  const response = await axios.get('http://localhost:5000/api/auth/user', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};


export const loginUser = async (username, password) => {
  const response = await axios.post('http://localhost:5000/api/auth/login', { username, password });
  return response.data;
};


export const fetchCartItems = async (userId) => {
  try {
    const response = await axios.get(`http://localhost:5000/api/cart/${userId}`);
    return response.data; // Assuming your response data directly contains the cart items
  } catch (error) {
    console.error('Error fetching cart items:', error);
    throw error;
  }
};


export const addToCart = async (userId, bookId, quantity) => {
  try {
    const response = await axios.post(`http://localhost:5000/api/cart/add-to-cart`, {
      userId,
      bookId,
      quantity
    });
    return response.data;
  } catch (error) {
    console.error('Error adding to cart:', error);
    throw error;
  }
};


export const removeCartItem = async (userId, bookId) => {
  try {
    const response = await axios.delete(`http://localhost:5000/api/cart/${userId}/${bookId}`);
    return response.data;
  } catch (error) {
    console.error('Error removing cart item:', error);
    throw error;
  }
};


// Function to create order in the backend
export async function createOrder(sessionId, userId, cartItems) {
  try {
    const response = await axios.post(`${BASE_URL}/api/orders/new`, {
      sessionId,
      userId,
      cartItems,
    });

    if (!response.data) {
      throw new Error('Failed to create order');
    }

    return response.data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
}

export const fetchOrders = async (userId) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/orders/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};


export const fetchAllUsers = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/admin/users`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};


export const fetchAllOrders = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/admin/orders`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};


export const sendContactMessage = async (formData) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/contact`, formData);
    return response;
  } catch (error) {
    console.error('There was an error sending the message:', error);
    throw error;
  }
};


export const fetchContactMessages = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/contact`);
    return response.data;
  } catch (error) {
    console.error('Error fetching contact messages:', error);
    throw error;
  }
};


export const forgotPassword = async (email) => {
  const response = await axios.post(`${BASE_URL}/api/auth/forgot-password`, {email} );
  return response.data;
};


export const resetPassword = async (token, newPassword) => {
  const response = await axios.post(`${BASE_URL}/api/auth/reset-password`, { token, newPassword });
  return response.data;
};

