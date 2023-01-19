// middlware декодер.токен,проверка валидности

// подкл.ф.контролера для генерац.web токена
const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  // е/и mtd OPTIONS то продолжаем
  if (req.method === "OPTIONS") {
    next();
  }
  try {
    // достаём токен(отделяя от Типа передающ по ind 0) из шапки(обычн.там токен)
    const token = req.headers.authorization.split(" ")[1]; // Bearer asfasnfkajsfnjk
    // ? нужна доп.проверка по токену на авториз.
    // if (!token) {
    //   return res.status(401).json({ message: "Не авторизован" });
    // }
    // раскодир.токен. `проверять` на валидность(токен, секр.ключ)
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    // к запросу в поле user добав.раскодированые данн.
    req.user = decoded;
    // вызов след.middlware
    next();
  } catch (e) {
    // проверка по токену на авториз.
    res.status(401).json({ message: `Не авторизован. Ошибка ${e}` });
  }
};
