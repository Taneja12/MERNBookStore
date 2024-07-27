const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: "https://mern-book-store-ajdb-frontend.vercel.app",
  methods: ["POST", "GET"],
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

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

// Define API routes
app.use('/api/books', bookRouter);
app.use('/api/category', catRouter);
app.use('/api/auth', authRouter);
app.use('/api/orders', ordercreationRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/contact', contactRouter);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
