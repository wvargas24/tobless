const mongoose = require('mongoose');
const logger = require('../config/logger'); // Importar el logger

// URL de conexión a MongoDB
const env = process.env.NODE_ENV || 'development'; // Por defecto será 'development'
const MONGO_URI = env === 'production' ? process.env.MONGO_URI_PROD : process.env.MONGO_URI_DEV;

// Conexión a MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true, // Estas opciones pueden no ser necesarias en versiones recientes de Mongoose, pero se mantienen por compatibilidad
      useUnifiedTopology: true,
    });

    logger.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    logger.error(`Error: ${error.message}`);
    process.exit(1); // Salir del proceso con error
  }
};

module.exports = connectDB;
