import mongoose from 'mongoose';
import dotenv from 'dotenv';

import logger from './logger.js';
dotenv.config();

// URL de conexión a MongoDB
const env = process.env.NODE_ENV || 'production'; // Por defecto será 'production'
const MONGO_URI = env === 'production' ? process.env.MONGO_URI_PROD : process.env.MONGO_URI_DEV;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1); // Exit with a non-zero code to indicate an error
  }
};

export default connectDB;

