// middleware по добав.нов.устройство только ADMIN, +декодер,валид.

// от ошб.повтор.объяв.перем в блоке
// export {};

// подкл.обраб.ошиб.
const ApiErrorJS = require("../error/ApiErrorJS");
const TokenService = require("../services/token.service");

// interface T {
//   string: string;
// }

// экспорт fn принимающая Роль (вызов fn с передачей Роли и возврат.middleware)
module.exports = function (role /* : Array<T> */ /* : string */) {
  // возвращ. сам middleware
  return function (req, res, next) {
    // ~ console.log("role ", role); // [ 'SUPER', 'ADMIN', 'MODER' ]
    if (req.method === "OPTIONS") {
      next();
    }
    try {
      // провер header на наличие поля authorization
      const authorizationHeader = req.headers.authorization;
      if (!authorizationHeader) {
        return next(ApiErrorJS.UnauthorizedError("authoriz undf"));
      }
      // достаём токен из header (отделяя от Типа`Носитель` передающ по ind 0) из шапки(обычн.там токен)
      const accessToken = authorizationHeader.split(" ")[1]; // Bearer asfasnfkajsfnjk..
      if (!accessToken) {
        return next(ApiErrorJS.UnauthorizedError("Токен err" /* , `${e}` */));
        // return res.status(401).json({ message: "Не авторизован" });
      }

      // проверка валидации
      // const decoded = jwt.verify(token, process.env.SECRET_KEY);
      // req.id = decoded.id;
      const decoded = TokenService.validateAccessToken(accessToken);
      if (!decoded) {
        return next(
          ApiErrorJS.UnauthorizedError("Токен не валид" /* , `${e}` */)
        );
      }

      // раскодир.токен.`проверять`на валидность. const опред.с др.именем т.к. role уже есть. получ.масс.Ролей
      // const { role: userRoles } = jwt.verify(token, process.env.SECRET_KEY);
      const { role: userRoles } = TokenService.validateAccessToken(accessToken);
      // ~ console.log("userRoles ", userRoles); // от польз. ~ USER
      if (!userRoles) {
        return next(ApiErrorJS.UnauthorizedError("НЕТ РОЛИ" /* , `${e}` */));
      }
      // проверка масс.польз.Ролей с масс.разреш.Ролей для этой fn
      // перем.для определения
      let hasRoles = false;
      // итерац.по Ролям.польз.
      [userRoles].forEach((uRol) => {
        // ~ console.log("uRol ", userRoles, uRol); // от польз. ~ USER
        // е/и масс.разреш.Ролей содерж Роль польз.
        if (role.includes(uRol)) {
          // перем.в true
          hasRoles = true;
        }
      });
      // ! ошб. - НЕ воспринимает все позиции, только первую если передавать role из auth.rout без []. Попробовать редачить в checkRole
      if (!hasRoles) {
        return next(
          ApiErrorJS.BadRequest(
            `Нет доступа у Роли ${decoded.role} или ошб.Ролей`
          )
        );
      }
      req.user = decoded;
      next();
    } catch (e) {
      // res.status(401).json({ message: `Не авторизован. Ошибка ${e}` });
      throw next(ApiErrorJS.UnauthorizedError("!", `${e}`));
    }
  };
};
