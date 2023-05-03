// ^ Tok. Запуск Сервера для до СЛН. Базов.конфиг для приёма запросов
import config from "dotenv/config";
import express from "express";
import sequelize from "./sequelize.js";
import * as mapping from "./models/mapping.js";
import cors from "cors";
import fileUpload from "express-fileupload";
import router from "./routes/index.js";
import ErrorHandler from "./middleware/ErrorHandler_Tok.js";

const PORT = process.env.PORT_Tok || 5000;

const app = express();
// Совместное использование ресурсов между источниками
app.use(cors());
// middleware для работы с json
app.use(express.json());
// middleware для статики (img, css)
app.use(express.static("static"));
// middleware для загрузки файлов
app.use(fileUpload());
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
    app.listen(PORT, () => console.log("Сервер запущен на порту", PORT));
  } catch (e) {
    console.log(e);
  }
};

start();
