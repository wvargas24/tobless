import dotenv from 'dotenv';
dotenv.config(); // Cargar variables de entorno al principio

import app from './app.js'; // Importar la aplicación Express desde app.js
import connectDB from './config/db.js'; // Importar la función de conexión a la base de datos
import logger from './config/logger.js'; // Importar el logger

const PORT = process.env.PORT || 3000; // Usar el puerto de las variables de entorno

// Conectar a la base de datos y luego iniciar el servidor
connectDB()
  .then(() => {
    logger.info('MongoDB Connected...');
    app.listen(PORT, () => logger.info(`Server started on port ${PORT}`)); // Iniciar el servidor Express
  })
  .catch((err) => {
    logger.error('MongoDB connection error:', err);
    process.exit(1); // Salir del proceso con error si falla la conexión a la DB
  });
