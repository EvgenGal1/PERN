// Запуск Сервера. Баз.конфиг для приёма запросов

// получ express ч/з require для прилож.
const express = require("express");
// // подкл.ф.наст.конфигураций
// const config = require("config");
// подкл. ф.настр.маршрутов
const userRoutes = require("./routes/user.routes");
// // подкл. mongoDB ч/з mongoose для базы данных
// const mongoose = require("mongoose");
// // от ошибки устаревшего кода
// mongoose.set("strictQuery", false);

// в конст PORT запис.порт из config (сист.перем.) или 5000
const PORT = /* config.get("port") */ process.env.PORT || 5005;

// созд.server
const app = express();
// парсим json сервером
app.use(express.json());
// ! от ошб
// app.use(
//   express.urlencoded({
//     extended: true,
//   })
// );
// прослуш. маршруты для обраб.запросов с fronta. 1ый str. префикс для пути(/api), 2ой подкл. Маршрутизатор(middleware)
app.use("/PERN", userRoutes);

// тест1
// app.get("/", (req, res) => {
//   res.send(
//     `<body style='text-align: center;;font-family: sans-serif;background:#4b0000'>
//       <h1 style='font-weight: 900'>Старт PERN 0.0.2</h1>
//       <p style='font-weight: 900;'>PostgreSQL, Express, React, NodeJS</p>
//       <p>%{ PORT }</p>
//     </body>`
//   );
// });
// `прослушка` сервера на PORT c fn колбэк cg при успехе,провер.err
app.listen(PORT, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log(`Сервер запущен на порту ${PORT}.....`);
});

// // парсим json сервером
// app.use(express.json());
// // прослуш. маршруты для обраб.API запросов с fronta. 1ый str. префикс для пути(/api/auth), 2ой подкл. middleware
// app.use("/auth", authRoutes /* require("./routes/auth.routes") */);

// // Запуск Сервера | const start = () => {}. fn обёртк. для mongoose
// async function start() {
//   // всё верно
//   try {
//     // подкл. к БД. await для ожидан. промиса. Вызов mongoose.мтд.connect. 1ый парам url адрес с БД(из config), 2ой парам. набор опций
//     await mongoose.connect(config.get("mongoUri"), {
//       // парам из видео для успешн.connect
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//       // useCreateIndex: true,
//     });
// логика приложен.
// маршр.получ.запроса на гл.стр. В Ответ h5 с текстом
// app.get("/", (req, res) => {
//   res.send(
//     `<body style='text-align: center;;font-family: sans-serif;background:#4b0000'>
//       <h1 style='font-weight: 900'>Старт PERN 0.0.2</h1>
//       <p style='font-weight: 900;'>PostgreSQL, Express, React, NodeJS</p>
//       <p>%{ PORT }</p>
//     </body>`
//   );
// });
// // `прослушка` сервера на PORT c fn колбэк cg при успехе,провер.err
// app.listen(PORT, (err) => {
//   if (err) {
//     return console.log(err);
//   }
//   console.log(`Сервер запущен на порту ${PORT}.....`);
// });
//   } catch (error) {
//     // отраб.ошб.
//     console.log("Ошибка сервера", error.message);
//     // выход ч/з глоб.проц.мтд .exit
//     process.exit(1);
//   }
// }
// start();
