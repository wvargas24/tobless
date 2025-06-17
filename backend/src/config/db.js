const mongoose = require('mongoose');
const logger = require('../config/logger'); // Importar el logger

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
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
