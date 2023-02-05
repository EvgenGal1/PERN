// middleware по добав.нов.устройство только ADMIN, +декодер,валид.

const jwt = require("jsonwebtoken");
// подкл.обраб.ошиб.
const ApiError = require("../error/ApiError");
const TokenService = require("../services/token.service.js");

// экспорт fn принимающая Роль (вызов fn с передачей Роли и возврат.middleware)
module.exports = function (role) {
  // возвращ. сам middleware
  return function (req, res, next) {
    if (req.method === "OPTIONS") {
      next();
    }
    try {
      // провер header на наличие поля authorization
      const authorizationHeader = req.headers.authorization;
      if (!authorizationHeader) {
        return next(ApiError.UnauthorizedError("_"));
      }
      // достаём токен из header (отделяя от Типа`Носитель` передающ по ind 0) из шапки(обычн.там токен)
      const accessToken = authorizationHeader.split(" ")[1]; // Bearer asfasnfkajsfnjk..
      if (!accessToken) {
        return next(ApiError.UnauthorizedError("=" /* , `${e}` */));
        // return res.status(401).json({ message: "Не авторизован" });
      }

      // проверка валидации
      // const decoded = jwt.verify(token, process.env.SECRET_KEY);
      // req.id = decoded.id;
      const decoded = TokenService.validateAccessToken(accessToken);
      if (!decoded) {
        return next(ApiError.UnauthorizedError("/" /* , `${e}` */));
      }

      // раскодир.токен.`проверять`на валидность. const опред.с др.именем т.к. role уже есть. получ.масс.Ролей
      // const { role: userRoles } = jwt.verify(token, process.env.SECRET_KEY);
      const { role: userRoles } = TokenService.validateAccessToken(accessToken);
      if (!userRoles) {
        return next(ApiError.UnauthorizedError("" /* , `${e}` */));
      }

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
        return next(
          ApiError.BadRequest(
            `Нет доступа у Роли ${decoded.role} или ошб.Ролей`
          )
        );
      }
      req.user = decoded;
      next();
    } catch (e) {
      // res.status(401).json({ message: `Не авторизован. Ошибка ${e}` });
      throw next(ApiError.UnauthorizedError("-", `${e}`));
    }
  };
};
