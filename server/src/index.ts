// ^ Запуск Сервера. Базов.конфиг для приёма запросов

// расшир.типов > auth с принудит.загр.кода ч/з TS config
/// <reference path="./config/express/index.d.ts" />
// express ч/з require для прилож.
import express, { Application, Request, Response } from 'express';
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
// подкл. БД/Модулей/табл.
import initModels from './models/index';
// общ.ф.настр.маршрутизаторов
import router from './routes/index.routes';
// MW обраб.ошб.
import ErrorHandler from './middleware/errors/ErrorHandler';
// логирование LH Winston
import { logger } from './config/logging/log_winston.config';
// MW логгирование входящих HTTP запросов
import {
  requestLoggingMiddleware as reQLog,
  responseLoggingMiddleware as reSLog,
} from './middleware/logging/logging.middleware';
// документирование/настр. Swagger
import {
  documentSwagger,
  // loadSwaggerStyles,
} from './config/documents/swagger.config';
// константы > команды запуска process.env.NODE_ENV
import { isDevelopment } from './config/envs/env.consts';
import { htmlContent } from './utils/varWelcom';

// --- НАСТРОЙКА ОКРУЖЕНИЯ ---
// загр.перем.окруж.из опред.ф.env
config({ path: `.env.${process.env.NODE_ENV}` });
// опред.среды запуска
const NODE_ENV = process.env.NODE_ENV || 'development';

// --- СОЗДАНИЕ EXPRESS-ПРИЛОЖЕНИЯ ---
// созд.server
const app: Application = express();
// порт из перем.окруж. | умолч.
const PORT = isDevelopment ? Number(process.env.SRV_PORT) : 5000;
const PUB_DIR = process.env.PUB_DIR || 'public';

// --- ИНИЦИАЛИЗАЦИЯ МОДЕЛЕЙ/СВЯЗЕЙ ТАБЛ.БД (синхр.до маршрт.от ошб.сборки Vercel) ---
initModels();

// --- НАСТРОЙКА MIDDLEWARE (Синхронные) ---
// совместн.использ.ресурс.разн.источников client/server > разрещ.(url,cookie)
app.use(
  cors({
    credentials: true,
    origin: function (origin, callback) {
      const allowedOrigins = [
        process.env.CLT_URL,
        process.env.CLT_URL_DUBL,
        process.env.CLT_URL_PROD,
      ];
      if (!origin || allowedOrigins.includes(origin)) callback(null, true);
      else callback(new Error('Не разрешён CORS'));
    },
  }),
);
// раб.с cookie
app.use(cookieParser(process.env.SECRET_KEY));
// возм.парсить json
app.use(express.json());
// логг.Winston вход.HTTP req
app.use(reQLog);
app.use(reSLog);
// стат.ф. (img, css)
app.use(express.static(path.join(__dirname, `../${PUB_DIR}`)));
// загр.ф.
app.use(fileUpload());

// --- НАСТРОЙКА МАРШРУТОВ ---
// обраб./прослуш. всех маршр.приложения (путь, Маршрутизатор)
app.use(`/${process.env.SRV_NAME}`, router);
// приветствие/детали подключения
app.get('/', (req: Request, res: Response) => {
  res.send(htmlContent);
});
app.get('/details', (req: Request, res: Response) => {
  const connectionDetails = `${isDevelopment ? 'DEV' : 'PROD'}    SRV: ${process.env.SRV_URL}    DB: ${process.env.DB_HOST} / ${process.env.DB_PORT}`;
  res.send(connectionDetails);
});

// документирование (Swagger)
documentSwagger(app);

// обработка ошибок
app.use(ErrorHandler);

// --- АСИНХРОННЫЙ ЗАПУСК СЕРВЕРА ---
const start = async (): Promise<void> => {
  try {
    // --- ИНИЦИАЛИЗАЦИЯ БД ---
    // подкл.к БД.
    await sequelize.authenticate();
    // проверка подкл.к БД
    if (isDevelopment) await connectToDatabase();
    // синхрониз.структуру БД со схемой данн.(опред.моделью)
    if (isDevelopment)
      await sequelize
        .sync({
          // force: true, // удал./созд.табл.
          alter: true, // обнов.табл.
        })
        .then(() => {
          if (process.env.MEGA_TEST === 'true' && isDevelopment)
            console.log('Синхронизация завершена');
        })
        .catch((error) => console.error('Ошибка при синхронизации:', error));

    // --- ЗАПУСК СЕРВЕРА ---
    // цвета запуска: DEV - зелённый, PROD - синий
    const mainColor = isDevelopment ? '\x1b[36m' : '\x1b[34m';
    // прослуш.подключ.PORT и fn()callback
    app.listen(PORT, () => {
      // вывод с цветом подкл.к БД от NODE_ENV
      console.log(
        `\x1b[41m${NODE_ENV.toUpperCase()}\x1b[0m   MAIN   \x1b[41mSRV\x1b[0m ${mainColor}${process.env.SRV_URL}\x1b[0m   \x1b[41mDB\x1b[0m \x1b[33m${process.env.DB_HOST} : ${process.env.DB_PORT}\x1b[0m`,
      );
      if (isDevelopment) {
        logger.info(
          `DEV   MAIN   SRV ${process.env.SRV_URL}   DB ${process.env.DB_HOST} : ${process.env.DB_PORT}`,
        );
      }
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.log('ошибка запуска сервера : ', err.message);
    logger.error(`ошибка запуска сервера, e.msg: ${err?.message}`, {
      stack: err?.stack,
    });
    process.exit(1);
  }
};

// start() при прямом запуске > изоляции сервера при тестах с обраб.ошб.
if (require.main === module) start().catch(console.error);

// экспорт приложения > тестов
export default app;
