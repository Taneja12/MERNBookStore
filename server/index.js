const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
require('dotenv').config();
require('./config/passportConfig'); // Import Passport config

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration for different environments
const corsOptions = {
  origin: 'https://mern-book-store-ajdb-frontend-deepanshu-tanejas-projects.vercel.app', // Frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-api-version'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// CORS middleware
if (process.env.NODE_ENV === 'production') {
  app.use(cors(corsOptions)); // Use specific CORS options for production
} else {
  app.use(cors()); // Allow all origins for development
}
app.options('*', cors(corsOptions)); 

// Session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: process.env.NODE_ENV === 'production' } // Secure cookies in production
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
const bookRouter = require('./routes/bookRouter');
const authRouter = require('./routes/auth'); // Renamed for clarity
const catRouter = require('./routes/catRouter');
const ordercreationRoutes = require('./routes/payRouter');
const cartRoutes = require('./routes/cartRouter');
const adminRoutes = require('./routes/adminRoutes');
const contactRouter = require('./routes/contactRouter');

// Define API routes
app.use('/api/books', bookRouter);
app.use('/api/category', catRouter);
app.use('/api/auth', authRouter);
app.use('/api/orders', ordercreationRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/contact', contactRouter);

app.get('/', (req, res) => {
  res.json('API is working!');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ message: 'Server Error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
