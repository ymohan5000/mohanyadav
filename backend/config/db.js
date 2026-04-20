const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Check if URI exists
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI environment variable is not set');
    }

    // Set mongoose connection options for Vercel
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
      retryWrites: true,
      w: 'majority',
      maxPoolSize: 1,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    // Don't exit, allow retry
    throw error;
  }
};

module.exports = connectDB;
