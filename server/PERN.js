// Запуск Сервера. Базов.конфиг для приёма запросов

// подкл.ф.наст.конфигураций
// const config = require("config");
require("dotenv").config();
// получ express ч/з require для прилож.
const express = require("express");
// подкл.конфиг.БД
const { sequelize } = require("./db");
// подкл.моделей(табл)
const models = require("./models/models");
// подкл.cors для отправ.запр.с брауз.
const cors = require("cors");

// подкл.общ.ф.настр.маршрутизаторов(UlbiTV.PERNstore) + отд.ф.для UlbiTV.NPg;
const allRoutes = require("./routes/all.routes");
const userRoutes = require("./routes/user.routes");
const postRoutes = require("./routes/post.routes");

// в конст PORT запис.порт из config (сист.перем.) или 5000
// const PORT = config.get("port") || 7531;
const PORT = process.env.PORT || 7531;

// созд.server
const app = express();
// возм.парсить json
app.use(express.json());
// передача cors в app
app.use(cors());
// ?! от ошб ?
// app.use(
//   express.urlencoded({
//     extended: true,
//   })
// );

// тест1 - проверка в Postman|браузере
// app.get("/", (req, res) => {
//   res.send(
//     `<body style='text-align: center;;font-family: sans-serif;background:#4b0000'>
//       <h1 style='font-weight: 900'>Старт PERN 0.0.2</h1>
//       <p style='font-weight: 900;'>PostgreSQL, Express, React, NodeJS</p>
//       <p>Работает по адресу http://localhost:${PORT}</p>
//     </body>`
//   );
//   // .status(200)
//   // .json({ message: `Работает по адресу http://localhost:${PORT}/` });
// });

// прослуш. маршруты для обраб.запросов с fronta. 1ый str. префикс для пути(/api), 2ой подкл. Маршрутизатор(middleware)
app.use("/PERN", allRoutes);
app.use("/PERN", userRoutes);
app.use("/PERN", postRoutes);

// app.use("/auth", authRoutes /* require("./routes/auth.routes") */);

// Запуск Сервера | const start = async () => {}
// async function start() {
const start = async () => {
  //   //   // всё верно
  try {
    // подкл.к БД.
    await sequelize.authenticate();
    // сверка сост.БД со схемой данн. ~
    await sequelize.sync();

    // `прослушка` сервера на PORT c fn колбэк cg при успехе,провер.err
    app.listen(PORT, (err) => {
      if (err) {
        return console.log(err);
      }
      console.log(`Сервер запущен на порту ${PORT}.....`);
    });
  } catch (error) {
    // отраб.ошб.
    console.log("Ошибка сервера", error.message);
    //     // выход ч/з глоб.проц.мтд .exit
    //     // process.exit(1);
  }
};

start();
