const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Import the User model
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const verifyGoogleToken = async (req, res) => {
  const { idToken } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const googleId = payload['sub']; // Google user ID

    // Find or create a user using the Google ID
    let user = await User.findOne({ googleId });

    if (!user) {
      // Create a new user if not exists
      user = new User({
        username: payload['name'], // Adjust according to your needs
        email: payload['email'],
        phone: 9999999999, // Set default or null if not provided
        googleId: googleId,
      });

      await user.save();
    }

    // Check if the user's phone number is missing
    const phoneMissing = !user.phone;

    // Generate JWT token using MongoDB user _id
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token, phoneMissing });
  } catch (error) {
    console.error('Error verifying Google token:', error);
    res.status(401).json({ message: 'Invalid Google token' });
  }
};

module.exports = { verifyGoogleToken };
