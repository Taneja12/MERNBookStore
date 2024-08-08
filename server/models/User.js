const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  phone: { type: Number, default:true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' }, // Add role field
  googleId: { type: String }, // Add this field for Google Sign-In
  resetPasswordToken: { type: String }, // Add reset password token field
  resetPasswordExpires: { type: Date }  // Add reset password token expiration field
});

module.exports = mongoose.model('User', userSchema);
