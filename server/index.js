const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors(
  {
    origin: "https://mern-book-store-ajdb-frontend.vercel.app",
    methods: ["POST", "GET"],
    credentials: true
  }
));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB connection
// mongoose.connect('mongodb://127.0.0.1:27017/mydatabase');
mongoose.connect(process.env.MONGODB_URI);


const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Routes
const bookRouter = require('./routes/bookRouter');
const authRouter = require('./routes/auth');
const catRouter = require('./routes/catRouter');
const ordercreationRoutes = require('./routes/payRouter');
const cartRoutes = require('./routes/cartRouter');
const adminRoutes = require('./routes/adminRoutes');
const contactRouter = require('./routes/contactRouter');

app.get('/', (req, res) => {
  res.json('API is working!');
});
// Endpoint for books and categories
app.use('/api/books', bookRouter);
app.use('/api/category', catRouter);

// Endpoint for authentication
app.use('/api/auth', authRouter);

// Endpoint for creating orders and payment session ID
app.use('/api/orders', ordercreationRoutes);

app.use('/api/cart', cartRoutes);

app.use('/api/admin', adminRoutes);

app.use('/api/contact', contactRouter);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});