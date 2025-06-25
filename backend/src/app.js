const express = require('express');
const cors = require('cors'); // Asegúrate de tener cors instalado

// Importar rutas usando require
const authRoutes = require('./routes/auth.routes');
const membershipRoutes = require('./routes/membership.routes');
const bookingRoutes = require('./routes/booking.routes');
const userRoutes = require('./routes/user.routes');
const staffRoutes = require('./routes/staff.routes');

// Importar middleware de error
const { errorHandler } = require('./middlewares/errorMiddleware');

const app = express(); // Initialize express app

// Middlewares
app.use(express.json()); // Middleware para parsear JSON
app.use(express.urlencoded({ extended: false })); // Opcional: middleware para parsear datos de formularios URL-encoded

app.use(cors()); // Habilitar CORS (configuración básica)

// Definir Rutas
app.get('/', (req, res) => res.send('API Running'));

// Usar Rutas con prefijos
app.use('/api/auth', authRoutes);
app.use('/api/memberships', membershipRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/users', userRoutes);
app.use('/api/staff', staffRoutes);

// Middleware de manejo de errores
app.use(errorHandler);

module.exports = app; // Exportar la aplicación Express