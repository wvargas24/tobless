const winston = require('winston');
const path = require('path');
const fs = require('fs');

// Ensure log directory exists
const logDir = 'logs';
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// Environment variables are assumed to be loaded in server.js
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  verbose: 4,
  debug: 5,
  silly: 6,
};

const level = () => {
  const env = process.env.NODE_ENV || 'development';
  const isDevelopment = env === 'development';
  return isDevelopment ? 'debug' : 'info';
};

// Console output format
const consoleFormat = winston.format.combine(
  winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss'
  }),
  winston.format.colorize({
    all: true
  }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`,
  ),
);

// File output format
const fileFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.json()
);

const transports = [
  // Console transport remains unchanged
  new winston.transports.Console({
    format: consoleFormat
  }),
  // File transport for all logs
  new winston.transports.File({
    filename: path.join(logDir, 'all.log'),
    format: fileFormat,
  }),
  // File transport for error logs
  new winston.transports.File({
    level: 'error',
    filename: path.join(logDir, 'error.log'),
    format: fileFormat,
  }),
];

const logger = winston.createLogger({
  level: level(),
  levels,
  transports,
});

module.exports = logger;