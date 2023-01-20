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
      req.userId = decoded._id;

      // раскодир.токен.`проверять`на валидность. const опред.с др.именем т.к. role уже есть
      // получ.масс.Ролей
      const { roles: userRoles } = jwt.verify(token, process.env.SECRET_KEY);

      // проверка масс.разреш.Ролей с разреш.для этой fn
      // перем.для определения
      // let hasRoles = false;
      // // итерац.по Ролям.польз.
      // userRoles.forEach((roles) => {
      //   // е/и масс.разреш.Ролей содерж Роль польз.
      //   if (role.includes(roles)) {
      //     // перем.в true
      //     hasRoles = true;
      //   }
      // });
      let hasRole = false;
      userRoles.forEach((roles) => {
        if (role.includes(roles)) {
          hasRole = true;
        }
      });
      if (!hasRole) {
        return res
          .status(403)
          .json({ message: `Нет доступа у Роли ${decoded.role}` });
      }
      // req.user = decoded;
      next();
    } catch (e) {
      console.log(e);
      res.status(401).json({ message: `Не авторизован. Ошибка ${e}` });
    }
  };
};
