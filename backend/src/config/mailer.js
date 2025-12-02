// backend/src/config/mailer.js
const nodemailer = require('nodemailer');
const logger = require('./logger');

const transporter = nodemailer.createTransport({
    service: 'gmail', // O usa 'host' y 'port' para otros servicios SMTP
    auth: {
        user: process.env.EMAIL_USER, // Tu correo (ej. tobless.coworking@gmail.com)
        pass: process.env.EMAIL_PASS  // Tu contraseña de aplicación (App Password)
    }
});

const sendEmail = async (to, subject, htmlContent) => {
    try {
        const mailOptions = {
            from: `"ToBless Coworking" <${process.env.EMAIL_USER}>`,
            to: to,
            subject: subject,
            html: htmlContent
        };

        const info = await transporter.sendMail(mailOptions);
        logger.info(`Correo enviado a: ${to} - MessageID: ${info.messageId}`);
        return info;
    } catch (error) {
        logger.error('Error enviando correo:', error);
        // No lanzamos el error para no romper el flujo principal (ej. el registro debe seguir aunque falle el correo)
        return null;
    }
};

module.exports = sendEmail;