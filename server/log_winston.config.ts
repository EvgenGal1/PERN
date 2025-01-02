import { createLogger, format, transports } from 'winston';
import path from 'path';

// созд.логгер
const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info', // уровень логирования (по умолчанию 'info')
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), // формат времени
    format.printf(({ timestamp, level, message }) => {
      // вывод для логов
      return `${timestamp} ${level}: ${message}`;
    }),
  ),
  transports: [
    new transports.Console(), // логи в консоль
    new transports.File({
      filename: path.join(__dirname, 'logs', 'error.log'),
      level: 'error', // логи ошибок в ф. error.log
    }),
    new transports.File({
      filename: path.join(__dirname, 'logs', 'all.log'), // все логи в ф. all.log
    }),
  ],
});

export default logger;
