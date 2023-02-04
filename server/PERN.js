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
// подкл.MiddlWare по ошб.
const errorHandlerMW = require("./middleware/ErrorHandlingMiddleware");
// подк.загрузчик файлов
const fileUpload = require("express-fileupload");
// подкл.для созд.пути
const path = require("path");
// подкл. MW по корр.раб. с cookie
const cookieParser = require("cookie-parser");

// подкл.общ.ф.настр.маршрутизаторов(UlbiTV.PERNstore) + отд.ф.для UlbiTV.NPg;
const allRoutes = require("./routes/all.routes");
// const userRoutes = require("./routes/user.routes");
// const postRoutes = require("./routes/post.routes");

// в конст PORT запис.порт из перек.опкруж. (| сист.перем. - config.get("port")) или 5000
const PORT = process.env.PORT || 7531;

// созд.server
const app = express();
// добав.cookieParser
app.use(cookieParser());
// передача cors в app для взаимодейств.server-браузер
app.use(
  cors(
    // указ.с каким domen обмен.cookie{разреш.,url front}
    {
      credentials: true,
      origin: process.env.CLIENT_URL,
      // origin: localhost/3000
    }
  )
);
// возм.парсить json
app.use(express.json());
// указ.ф.из static/ раздавать как статику(для получения) | ss.static("static"))
app.use(express.static(path.resolve(__dirname, "static")));
// регистр.загрузчика файлов с передачей пуст.объ
app.use(fileUpload({}));
// ?! от ошб ?
// app.use(
//   express.urlencoded({
//     extended: true,
//   })
// );
// прослуш. маршруты для обраб.запросов с fronta. 1ый str. префикс для пути(/api), 2ой подкл. Маршрутизатор(middleware)
// app.use("/auth", authRoutes /* require("./routes/auth.routes") */);
// app.use("/PERN", userRoutes);
// app.use("/PERN", postRoutes);
app.use("/PERN", allRoutes);

// Обраб.ошб.,последний Middlware
app.use(errorHandlerMW);

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

// Запуск Сервера | const start = async () => {}
// async function start() {
const start = async () => {
  //   //   // всё верно
  try {
    // подкл.к БД.
    await sequelize.authenticate();
    // сверка сост.БД со схемой данн. ~`продолжать`
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
