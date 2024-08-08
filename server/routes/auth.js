const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const passport = require('passport');
const nodemailer = require('nodemailer');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');
const { verifyGoogleToken } = require('../controllers/authController');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;
const SENDEMAIL_PASS = process.env.SENDEMAIL_PASS
// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'deepanshutaneja762@gmail.com',
    pass: SENDEMAIL_PASS,
  },
});

// Route: POST /api/login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if the user exists
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create JWT Token
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token });
  } catch (error) {
    console.error('Login error:', error); // Log the actual error for debugging
    res.status(500).json({ message: 'Server error' });
  }
});

// Route: POST /api/register
router.post('/register', async (req, res) => {
  const { username, email, password, phone } = req.body;

  try {
    // Check if user already exists
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    user = new User({ username, email, password, phone });

    // Encrypt password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Save user to database
    await user.save();

    res.json({ message: 'User registered successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.post('/google/signup', verifyGoogleToken);

// Route: GET /api/auth/user
// Fetch user details using authenticated token
router.get('/user', authMiddleware, async (req, res) => {
  try {
    // User object is attached to req object by authMiddleware
    const user = await User.findById(req.user).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Route: PUT /api/auth/user
router.put('/user', authMiddleware, async (req, res) => {
  const { username, email } = req.body;

  try {
    let user = await User.findById(req.user);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if username or email already exists
    if (username !== user.username) {
      const existingUsername = await User.findOne({ username });
      if (existingUsername && existingUsername._id.toString() !== user._id.toString()) {
        return res.status(400).json({ message: 'Username already exists' });
      }
    }

    if (email !== user.email) {
      const existingEmail = await User.findOne({ email });
      if (existingEmail && existingEmail._id.toString() !== user._id.toString()) {
        return res.status(400).json({ message: 'Email already exists' });
      }
    }

    // Update user details
    user.username = username;
    user.email = email;
    await user.save();

    res.json(user);
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Route: POST /api/auth/forgot-password
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  console.log(email)

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const token = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    const resetUrl = `https://mern-book-store-ajdb-frontend-deepanshu-tanejas-projects.vercel.app/reset-password/${token}`;
    const mailOptions = {
      to: user.email,
      from: 'deepanshutaneja762@gmail.com',
      subject: 'Password Reset',
      text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
             Please click on the following link, or paste this into your browser to complete the process:\n\n
             ${resetUrl}\n\n
             If you did not request this, please ignore this email and your password will remain unchanged.\n`,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Password reset email sent' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Route: POST /api/auth/reset-password
router.post('/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Password reset token is invalid or has expired' });
    }

    // Encrypt password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: 'Password has been reset' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

router.post('/google', verifyGoogleToken);

router.get('/google/callback', passport.authenticate('google', {
  failureRedirect: '/',
  session: true
}), async (req, res) => {
  try {
    const user = req.user;

    // Create JWT Token
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.redirect(`http://localhost:3000?token=${token}`);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});


router.post('/update-phone', authMiddleware, async (req, res) => {
  const { phone } = req.body;
  const userId = req.user.id; // Assuming `authMiddleware` attaches the user object to req

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.phone = phone.phone;
    await user.save();

    // Generate a new token with updated user info
    const token = jwt.sign({ userId: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ message: 'Phone number updated successfully', token });
  } catch (error) {
    console.error('Error updating phone number:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;
