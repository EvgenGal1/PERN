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
      // достаём токен
      const token = req.headers.authorization.split(" ")[1]; // Bearer asfasnfkajsfnjk
      if (!token) {
        return res.status(401).json({ message: "Не авторизован" });
      }

      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      // req.id = decoded.id;

      // раскодир.токен.`проверять`на валидность. const опред.с др.именем т.к. role уже есть. получ.масс.Ролей
      const { role: userRoles } = jwt.verify(token, process.env.SECRET_KEY);

      // проверка масс.польз.Ролей с масс.разреш.Ролей для этой fn
      // перем.для определения
      let hasRoles = false;
      // итерац.по Ролям.польз.
      [userRoles].forEach((uRol) => {
        // е/и масс.разреш.Ролей содерж Роль польз.
        if (role.includes(uRol)) {
          // перем.в true
          hasRoles = true;
        }
      });
      if (!hasRoles) {
        return res.status(403).json({
          message: `Нет доступа у Роли ${decoded.role} или ошб.Ролей`,
          // message: `Нет доступа у Роли ${decoded.role}`,
        });
      }
      // req.user = decoded;
      next();
    } catch (e) {
      console.log(e);
      res.status(401).json({ message: `Не авторизован. Ошибка ${e}` });
    }
  };
};
