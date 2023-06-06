// ^ Базов.конфиг TS для приёма запросов
import express from "express";
import config from "dotenv/config";
// ^ от ошб.для TS - [nodemon] clean exit - code: '28P01',length: 117,severity: '�����'
require("dotenv").config({ path: "./.env" });
import cors from "cors";
import fileUpload from "express-fileupload";
import cookieParser from "cookie-parser";

import sequelize from "./sequelize";
import * as mapping from "./models/mapping";
import router from "./routes/index.routes";
import ErrorHandler from "./middleware/ErrorHandler";
// import ErrorHandler from "./middleware/ErrorHandler_Tok.js";

const PORT = process.env.PORT_Tok || 5000;

const app = express();
// Совместное использование ресурсов между источниками + разрешить cookie от клиента
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
// middleware для работы с json
app.use(express.json());
// middleware для статики (img, css)
app.use(express.static("static"));
// middleware для загрузки файлов
app.use(fileUpload());
// MW для раб.с cookie
app.use(cookieParser(process.env.SECRET_KEY));
// обрабатываем все маршруты приложения
app.use("/api", router);

// обработка ошибок
app.use(ErrorHandler);

const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    app.listen(PORT, () =>
      console.log("Сервер Tok TSX запущен на порту", PORT)
    );
  } catch (e) {
    console.log(e);
  }
};

start();
