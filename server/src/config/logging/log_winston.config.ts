// ^ logger на winston

import { createLogger, format, transports } from 'winston';
import 'winston-daily-rotate-file';
import path from 'path';
import fs from 'fs';

// перем.окруж.
import { isDevelopment } from '../envs/env.consts';

// путь п.логов DEV/PROD
const logDir = isDevelopment ? path.join(process.cwd(), 'tmp/logs') : null;
// проверка/созд.п. > логов
if (isDevelopment && logDir)
  if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });

// форматы логирования
const { colorize, timestamp, combine, json, printf, errors } = format;

// конфиг/созд.логгера Winston
export const LoggingWinston = createLogger({
  level: isDevelopment ? 'debug' : 'info',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), // формат времени
    errors({ stack: true }), //  логг.стектрейса > ошб.
    isDevelopment
      ? combine(
          colorize(), // цв.отображ.
          printf(
            ({ timestamp, level, message, context, stack }) =>
              `${timestamp} ${level}: ${message}${context ? ` | ${context}` : ''}${stack ? `\nStack: ${stack}` : ''}`,
          ), // формат
        )
      : json(),
  ),
  transports: [
    // логи в консоль
    new transports.Console(),
    // детал.настр.общ.ф.логов > кажд.день
    ...(isDevelopment && logDir
      ? [
          new transports.DailyRotateFile({
            filename: path.join(logDir, 'application-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true, // архив.логи
            maxFiles: '14d', // дней хранений
            maxSize: '20m', // размер ф.в MB
          }),
          // доп.ф.error.log > лог.ошб.
          new transports.File({
            filename: path.join(logDir, 'error.log'),
            level: 'error',
          }),
        ]
      : []),
  ],
});

// логг. > PROD
// if (isProduction) {
//   LoggingWinston.add(
//     new transports.Http({
//       // отправка логов в сторонний сервис
//       host: 'log-service.example.com',
//       path: '/logs',
//       ssl: true,
//     }),
//   );
// }
