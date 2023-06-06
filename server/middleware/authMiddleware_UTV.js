// middlware декодер.токен,проверка валидности

// от ошб.повтор.объяв.перем в блоке
// export {};

// подкл.обраб.ошиб.
const ApiErrorJS = require("../error/ApiErrorJS");
const TokenService = require("../services/token.service");

module.exports = function (req, res, next) {
  console.log("SRV.authMW ", 987);
  // е/и mtd OPTIONS то продолжаем (проверка GET,POST,и т.д.)
  if (req.method === "OPTIONS") {
    next();
  }
  try {
    // провер header на наличие поля authorization
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
      return next(ApiErrorJS.UnauthorizedError("_"));
    }
    console.log("SRV.aMW authHead : " + authorizationHeader);
    // достаём токен из header (отделяя от Типа`Носитель` передающ по ind 0) из шапки(обычн.там токен)
    const accessToken = authorizationHeader.split(" ")[1]; // Bearer asfasnfkajsfnjk..
    if (!accessToken) {
      return next(ApiErrorJS.UnauthorizedError("" /* , `${e}` */));
      // return res.status(401).json({ message: "Не авторизован" });
    }

    // раскодир.токен. `проверять` валидации ч/з serv (токен)
    // const decoded = jwt.verify(token, process.env.SECRET_KEY);
    // req.id = decoded.id;
    const decoded = TokenService.validateAccessToken(accessToken);
    console.log("SRV.aMW decoded 1 : " + decoded);
    if (!decoded) {
      console.log("SRV.aMW decoded 2 : " + decoded);
      return next(ApiErrorJS.UnauthorizedError("" /* , `${e}` */));
    }

    // к запросу в поле user добав.раскодированые данн.
    req.user = decoded;
    // вызов след.middlware
    next();
  } catch (e) {
    // проверка по токену на авториз.
    // res.status(401).json({ message: `Не авторизован. Ошибка ${e}` });
    return next(ApiErrorJS.UnauthorizedError(e));
  }
};
