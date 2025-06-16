import express from 'express';
import cors from 'cors'; // Asegúrate de tener cors instalado

// Importar rutas usando rutas relativas
import authRoutes from './routes/auth.routes.js';
import membershipRoutes from './routes/membership.routes.js';
import bookingRoutes from './routes/booking.routes.js';

// Importar middlewares usando rutas relativas
import { errorHandler } from './middlewares/errorMiddleware.js'; // Asegúrate de la extensión .js

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

// Middleware de manejo de errores (colocar al final después de las rutas)
app.use(errorHandler);

export default app; // Exportar la aplicación Express
