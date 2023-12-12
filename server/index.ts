// ^ Запуск Сервера. Базов.конфиг для приёма запросов

// express ч/з require для прилож.
import express from "express";
// ф.наст./перем.конфигураций
// import config from "dotenv/config";
// ^ от ошб.для TS - [nodemon] clean exit - code: '28P01',length: 117,severity: '�����'
require("dotenv").config({ path: "./.env" });
// cors > отправ.запр.с брауз.
import cors from "cors";
// загрузчик файлов
import fileUpload from "express-fileupload";
// MW по корр.раб. с cookie
import cookieParser from "cookie-parser";

// схема БД
// import * as model from "./models/model";
// конфиг.БД
import sequelize from "./sequelize";
// MW jsoобраб.ошб.
import ErrorHandler from "./middleware/ErrorHandler";
// общ.ф.настр.маршрутизаторов
import router from "./routes/index.routes";

// порт из перем.окруж. | умолч.
const PORT = process.env.PORT_PERN || 5000;

// созд.server
const app = express();
// добав.cookieParser
app.use(cookieParser());
// совмес.использ.ресурсов м/у источниками. cors>взаимодейств.server-браузер + разрешить cookie от клиента
app.use(
  cors(
    // указ.с каким domen обмен.cookie{разреш.cok.,url front}
    {
      credentials: true,
      origin: process.env.CLIENT_URL_CLN,
    }
  )
);
// MiddleWare возм.парсить json
app.use(express.json());
// MW для статики (img, css)
app.use(express.static(/*path.resolve(__dirname,*/ "static") /*)*/);
// MW для загрузки файлов
app.use(fileUpload());
// MW для раб.с cookie
app.use(cookieParser(process.env.SECRET_KEY));
// обраб./прослуш. все маршруты приложения. 1ый str. префикс пути(/api), 2ой подкл.Маршрутизатор(MW)
app.use("/api", router);

// обработка ошибок
app.use(ErrorHandler);

const start = async () => {
  try {
    // подкл.к БД.
    await sequelize.authenticate();
    // синхрониз.структуру БД со схемой данн.(опред.моделью)
    await sequelize.sync();
    app.listen(PORT, () => {
      // if (erorr) {
      //   return console.log(erorr);
      // }
      console.log(`Сервер PERN (СЛН) запущен на порту, ${PORT}`);
    });
  } catch (erorr) {
    console.log(erorr);
  }
};

start();
