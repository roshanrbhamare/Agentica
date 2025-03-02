// db.js - MongoDB Connection
const mongoose = require('mongoose');
require('dotenv').config(); // Ensure you have dotenv installed: npm install dotenv

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  history: [
    {
      title: { type: String },
      docId: { type: String },
      metaData: { type: String },
    },
  ],
});

const User = mongoose.model('User', userSchema);

module.exports = { connectDB, User };
