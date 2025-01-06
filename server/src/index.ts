// ^ Запуск Сервера. Базов.конфиг для приёма запросов

// express ч/з require для прилож.
import express from 'express';
// наст./перем.окруж.
import { config } from 'dotenv';
// cors > отправ.запр.с брауз.
import cors from 'cors';
// загрузчик файлов
import fileUpload from 'express-fileupload';
// MW по корр.раб. с cookie
import cookieParser from 'cookie-parser';
import path from 'path';

// конфиг.БД
import sequelize, { connectToDatabase } from './config/sequelize';
// общ.ф.настр.маршрутизаторов
import router from './routes/index.routes';
// MW обраб.ошб.
import ErrorHandler from './middleware/errors/ErrorHandler';
// логирование LH Winston
import { LoggingWinston as logger } from './config/logging/log_winston.config';
// MW логгирование входящих HTTP запросов
import { loggingMiddleware as loggerMW } from './middleware/logging.middleware';
// документирование/настр. Swagger
import { documentSwagger } from './config/documents/swagger.config';
// константы > команды запуска process.env.NODE_ENV
import { isDevelopment, isProduction } from './config/envs/env.consts';

// загр.перем.окруж.из опред.ф.env
config({ path: `.env.${process.env.NODE_ENV}` });
// опред.среды запуска
const NODE_ENV = process.env.NODE_ENV || 'development';

// созд.server
const app = express();
// порт из перем.окруж. | умолч.
const PORT = process.env.SRV_PORT;
const PUB_DIR = process.env.PUB_DIR || 'public';

// совместн.использ.ресурс.разн.источников client/server > разрещ.cookie опред.url
app.use(cors({ credentials: true, origin: process.env.CLT_URL }));
// MiddleWare > раб.с cookie
app.use(cookieParser(process.env.SECRET_KEY));
// MW возм.парсить json
app.use(express.json());
// MW логг.Winston вход.HTTP req
app.use(loggerMW);
// MW > стат.ф. (img, css)
app.use(express.static(path.join(__dirname, `../${PUB_DIR}`)));
// MW > загр.ф.
app.use(fileUpload());

// обраб./прослуш. всех маршр.приложения (путь, Маршрутизатор)
app.use(`/${process.env.SRV_NAME}`, router);
// тест.маршрут
app.get('/', (req, res) => {
  res.send(`Hello, World!`);
});

// документирование (Swagger)
documentSwagger(app);

// обработка ошибок
app.use(ErrorHandler);

const start = async () => {
  try {
    // подкл.к БД.
    await sequelize.authenticate();
    // проверка подкл.к БД
    if (isDevelopment) await connectToDatabase();
    // синхрониз.структуру БД со схемой данн.(опред.моделью)
    await sequelize.sync();
    // цвета запуска: DEV - зелённый, PROD - синий
    const mainColor = isDevelopment ? '\x1b[32m' : '\x1b[34m';
    // прослуш.подключ.PORT и fn()callback
    app.listen(PORT, () => {
      // вывод с цветом подкл.к БД от NODE_ENV
      console.log(
        `\x1b[41m${NODE_ENV.toUpperCase()}\x1b[0m   MAIN   SRV: ${mainColor}${process.env.SRV_URL}\x1b[0m   DB: \x1b[33m${process.env.DB_NAME}:${process.env.DB_PORT}\x1b[0m`,
      );
      if (isDevelopment) {
        logger.info(
          `DEV   MAIN   SRV: ${process.env.SRV_URL}   DB: ${process.env.DB_NAME}:${process.env.DB_PORT}`,
        );
      }
    });
  } catch (error: unknown) {
    console.log('m.err : ', error);
    logger.error(`ошибка запуска сервера: ${(error as Error)?.message}`, {
      stack: (error as Error)?.stack,
    });
    process.exit(1);
  }
};

// start() при прямом запуске > изоляции сервера при тестах
if (isProduction) start();
else if (isDevelopment && require.main === module) start();
// экспорт приложения > тестов
export default app;
