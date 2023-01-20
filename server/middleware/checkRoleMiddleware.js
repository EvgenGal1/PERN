// middleware по добав.нов.устройство только ADMIN, +декодер,валид.

const jwt = require("jsonwebtoken");

// экспорт fn принимающая Роль (вызов fn с передачей Роли и возврат.middleware)
module.exports = function (role) {
  // возвращ. сам middleware
  return function (req, res, next) {
    if (req.method === "OPTIONS") {
      next();
    }
    try {
      const token = req.headers.authorization.split(" ")[1]; // Bearer asfasnfkajsfnjk
      if (!token) {
        return res.status(401).json({ message: "Не авторизован" });
      }
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      // проверка роли из токена с переданой в middleware
      // if (decoded.role !== role) {
      if (decoded.role) {
        if (decoded.role == "USER") {
          return res
            .status(403)
            .json({ message: `Нет доступа у Роли ${decoded.role} USER` });
        }
        if (decoded.role !== role) {
          return res
            .status(403)
            .json({ message: `Нет доступа у Роли ${decoded.role}` });
        }
      } else {
        return res.status(403).json({ message: `Нет доступа` });
      }

      req.user = decoded;
      next();
    } catch (e) {
      res.status(401).json({ message: `Не авторизован. Ошибка ${e}` });
    }
  };
};
