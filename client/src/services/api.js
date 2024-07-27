import axios from 'axios';

const BASE_URL ="https://mern-book-store-deepanshu-tanejas-projects.vercel.app"; // Use the production base URL
// const BASE_URL = "http://localhost:5000"


export const fetchBooks = async ({ page = 1, pageSize = 10 } = {}) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/books`, {
      params: { page, pageSize }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching books:', error);
    throw error;
  }
};

export const fetchBookDetails = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/books/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching book with ID ${id}:`, error);
    throw error;
  }
};

export const searchBooksByTitle = async (title) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/books/search`, {
      params: { title }
    });
    return response.data;
  } catch (error) {
    console.error(`Error searching books with title ${title}:`, error);
    throw error;
  }
};

export const fetchBooksByCategory = async (category) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/category/${category}`);
    return response.data;
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
  try {
    const response = await axios.get(`${BASE_URL}/api/auth/user`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user details:', error);
    throw error;
  }
};

export const loginUser = async (username, password) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/auth/login`, { username, password });
    return response.data;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/auth/register`, userData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error during user registration:', error.response?.data || error.message);
    throw error; // Rethrow to handle further up the chain
  }
};

export const fetchCartItems = async (userId) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/cart/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching cart items:', error);
    throw error;
  }
};

export const addToCart = async (userId, bookId, quantity) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/cart/add-to-cart`, {
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
    const response = await axios.delete(`${BASE_URL}/api/cart/${userId}/${bookId}`);
    return response.data;
  } catch (error) {
    console.error('Error removing cart item:', error);
    throw error;
  }
};

export const createOrder = async (sessionId, userId, cartItems) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/orders/new`, {
      sessionId,
      userId,
      cartItems,
    });
    return response.data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};


export const OrderCreation = async (orderData, token) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/orders/createOrder`, orderData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'x-api-version': '2023-08-01',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating order:', error.response?.data || error.message);
    throw error; // Re-throw the error to handle it further up the chain if needed
  }
};


export const fetchOrders = async (userId) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/orders/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

export const updateUserDetails = async (username, email) => {
  const token = localStorage.getItem('token');
  try {
    const response = await axios.put(
      `${BASE_URL}/api/auth/user`,
      { username, email },
      {
        headers: { Authorization: token },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating user data:', error);
    throw error;
  }
};

export const fetchAllUsers = async () => {
  const token = localStorage.getItem('token');
  try {
    const response = await axios.get(`${BASE_URL}/api/admin/users`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const fetchAllOrders = async () => {
  const token = localStorage.getItem('token');
  try {
    const response = await axios.get(`${BASE_URL}/api/admin/orders`, {
      headers: { Authorization: `Bearer ${token}` }
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
  try {
    const response = await axios.post(`${BASE_URL}/api/auth/forgot-password`, { email });
    return response.data;
  } catch (error) {
    console.error('Error during password recovery:', error);
    throw error;
  }
};

export const resetPassword = async (token, newPassword) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/auth/reset-password`, { token, newPassword });
    return response.data;
  } catch (error) {
    console.error('Error resetting password:', error);
    throw error;
  }
};
