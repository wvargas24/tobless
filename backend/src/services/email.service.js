// backend/src/services/email.service.js
const nodemailer = require('nodemailer');
const logger = require('../config/logger');

// Valida que las variables de entorno necesarias para Gmail estén presentes
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  logger.warn('Faltan variables de entorno para el servicio de correo con Gmail (EMAIL_USER, EMAIL_PASS). Los correos no se enviarán.');
}

logger.info('Creando transportador de nodemailer con Gmail...');
// Configura el transportador de Nodemailer usando Gmail
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER, // Tu correo de Gmail
    pass: process.env.EMAIL_PASS, // Tu Contraseña de Aplicación de Gmail
  },
  tls: {
    rejectUnauthorized: false
  }
});
logger.info('Transportador de nodemailer creado.');

/**
 * Envía un correo electrónico usando el transportador configurado.
 * @param {string} to - El destinatario del correo.
 * @param {string} subject - El asunto del correo.
 * @param {string} html - El contenido HTML del correo.
 * @throws {Error} Si el envío del correo falla.
 */
const sendEmail = async (to, subject, html) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    logger.error(`Intento de enviar correo a ${to} sin configuración completa de Gmail. Abortado.`);
    return;
  }
  
  const mailOptions = {
    from: `"ToBless Coworking" <${process.env.EMAIL_USER}>`,
    to: to,
    subject: subject,
    html: html,
    bcc: process.env.EMAIL_USER, // <-- Aquí se añade la copia oculta para el admin
  };

  // Log para visibilidad antes del envío
  logger.info(`Intentando enviar correo a: ${to} con asunto "${subject}"`);
  logger.info(`Usando host: smtp.gmail.com, port: 465, secure: true`);
  logger.info(`BCC a: ${mailOptions.bcc}`);


  try {
    logger.info('Llamando a transporter.sendMail...');
    const info = await transporter.sendMail(mailOptions);
    logger.info(`Correo enviado exitosamente a: ${to} - MessageID: ${info.messageId}`);
  } catch (error) {
    logger.error(`Error al enviar correo a ${to} con Gmail: ${error.message}`);
    logger.error(`Stack de error de nodemailer: ${error.stack}`);
    // No relanzar el error para no detener el flujo de la aplicación principal
  }
};

module.exports = {
  sendEmail,
};
