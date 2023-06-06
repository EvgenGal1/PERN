// ^ Tok. Запуск Сервера для до СЛН. Базов.конфиг для приёма запросов
import config from "dotenv/config";
import express from "express";
import sequelize from "./sequelize_Tok.js";
import * as mapping from "./models/mapping_Tok.js";
import cors from "cors";
import fileUpload from "express-fileupload";
import cookieParser from "cookie-parser";
import router from "./routes/index_Tok.js";
import ErrorHandler from "./middleware/ErrorHandler_Tok.js";

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
// // обрабатываем GET-запрос
// app.get("/", (req, res) => {
//   res.status(200).send("Hello, world!");
// });
// // обрабатываем POST-запрос
// app.post("/", (req, res) => {
//   res.status(200).json(req.body);
// });
// обрабатываем все маршруты приложения
app.use("/api", router);

// обработка ошибок
app.use(ErrorHandler);

const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    app.listen(PORT, () => console.log("Сервер Tok JS запущен на порту", PORT));
  } catch (e) {
    console.log(e);
  }
};

start();
