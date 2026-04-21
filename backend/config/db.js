const mongoose = require('mongoose');

let retryCount = 0;
const MAX_RETRIES = 3;

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI environment variable is not set');
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 15000,
      retryWrites: true,
      w: 'majority',
      maxPoolSize: 10,
      minPoolSize: 1,
      // Use directConnection=false for Atlas SRV
      directConnection: false,
    });

    retryCount = 0;
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    const isNetworkError =
      error.code === 'ECONNREFUSED' ||
      error.code === 'ENOTFOUND' ||
      error.message?.includes('querySrv') ||
      error.message?.includes('ECONNREFUSED');

    if (isNetworkError) {
      console.error(`MongoDB network error: ${error.message}`);
      console.error('Check: 1) MongoDB Atlas IP whitelist (add 0.0.0.0/0 for dev)  2) Network connectivity  3) MONGO_URI in .env');
    } else {
      console.error(`MongoDB connection error: ${error.message}`);
    }

    // Retry with backoff
    if (retryCount < MAX_RETRIES) {
      retryCount++;
      const delay = retryCount * 3000;
      console.log(`Retrying DB connection in ${delay / 1000}s... (attempt ${retryCount}/${MAX_RETRIES})`);
      await new Promise((r) => setTimeout(r, delay));
      return connectDB();
    }

    throw error;
  }
};

module.exports = connectDB;
