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
if (isDevelopment && logDir) {
  if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });
}

// форматы логирования
const { colorize, timestamp, combine, printf, errors } = format;

// формат для консоли (с цветами)
const consoleFormat = combine(
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  errors({ stack: true }),
  colorize(), // цв.отображ.
  printf(
    ({ timestamp, level, message, context, stack }) =>
      `${timestamp} ${level}: ${message}${context ? ` | ${context}` : ''}${stack ? `\nStack: ${stack}` : ''}`, // формат
  ),
);

// формат для файлов (без цветов с очисткой ANSI)
const fileFormat = combine(
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), // формат времени
  errors({ stack: true }), //  логг.стектрейса > ошб.
  printf(({ timestamp, level, message, context, stack }) => {
    // удал.ВСЕ ANSI escape codes из сообщения
    const cleanMessage =
      typeof message === 'string'
        ? message.replace(/\x1b\[[0-9;]*[mGKH]/g, '')
        : message;
    return `${timestamp} ${level}: ${cleanMessage}${context ? ` | ${context}` : ''}${stack ? `\nStack: ${stack}` : ''}`;
  }),
);

// конфиг/созд.логгера Winston
export const LoggingWinston = createLogger({
  level: isDevelopment ? 'debug' : 'info',
  format: fileFormat, // базовый формат без цветов
  transports: [
    // логи в консоль (с цветами)
    new transports.Console({
      format: consoleFormat,
    }),
    // детал.настр.общ.ф.логов > кажд.день
    ...(isDevelopment && logDir
      ? [
          new transports.DailyRotateFile({
            filename: path.join(logDir, 'application-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true, // архив.логи
            maxFiles: '14d', // дней хранений
            maxSize: '20m', // размер ф.в MB
            format: fileFormat, // формат без цветов
            options: { encoding: 'utf8' }, // указ.кодировки
          }),
          // доп.ф.error.log > лог.ошб.
          new transports.File({
            filename: path.join(logDir, 'error.log'),
            level: 'error',
            format: fileFormat, // формат без цветов
            options: { encoding: 'utf8' }, // указ.кодировки
          }),
        ]
      : []),
  ],
});

// экспорт.логгер без мтд.
export { LoggingWinston as logger };
