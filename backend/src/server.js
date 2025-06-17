require('dotenv').config(); // Cargar variables de entorno al principio

const app = require('./app'); // Importar la aplicación Express desde app.js
const connectDB = require('./config/db'); // Importar la función de conexión a la base de datos
const logger = require('./config/logger'); // Importar el logger

const PORT = process.env.PORT || 5000; // Usar el puerto de las variables de entorno

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
