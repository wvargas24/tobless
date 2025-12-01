const express = require('express');
const cors = require('cors'); // Asegúrate de tener cors instalado

// Importar rutas usando require
const authRoutes = require('./routes/auth.routes');
const membershipRoutes = require('./routes/membership.routes');
const bookingRoutes = require('./routes/booking.routes');
const resourceRoutes = require('./routes/resource.routes');
const resourceTypeRoutes = require('./routes/resourceType.routes');
const dashboardRoutes = require('./routes/dashboard.routes'); // Import dashboard routes
// Rutas adicionales que existían en la rama backend
const userRoutes = require('./routes/user.routes'); // Descomentar si existen los archivos
const staffRoutes = require('./routes/staff.routes'); // Descomentar si existen los archivos
const adminRoutes = require('./routes/admin.routes'); // Descomentar si existen los archivos

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
app.use('/api/resources', resourceRoutes);
app.use('/api/resourcetypes', resourceTypeRoutes);
app.use('/api/dashboard', dashboardRoutes); // Use dashboard routes

// Rutas adicionales de la rama backend (descomentar si se confirman los archivos)
app.use('/api/users', userRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/admin', adminRoutes);

// Middleware de manejo de errores
app.use(errorHandler);

module.exports = app; // Exportar la aplicación Express
