// db.js - MongoDB Connection
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/agentic');
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
      title: { type: String, required: true },
      docId: { type: String, required: true },
    },
  ],
});

const User = mongoose.model('User', userSchema);

module.exports = { connectDB, User };
