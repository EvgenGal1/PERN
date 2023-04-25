// ^ Tok. Запуск Сервера для до СЛН. Базов.конфиг для приёма запросов
import express from "express";
import config from "dotenv/config";
import sequelize from "./sequelize.js";
import * as mapping from "./models/mapping.js";
import cors from "cors";
import router from "./routes/index.js";

const PORT = process.env.PORT_Tok || 5000;

const app = express();
app.use(cors());
app.use(express.json());
// // обрабатываем GET-запрос
// app.get("/", (req, res) => {
//   res.status(200).send("Hello, world!");
// });
// // обрабатываем POST-запрос
// app.post("/", (req, res) => {
//   res.status(200).json(req.body);
// });
// обрабатываем все маршруты
app.use("/api", router);

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
