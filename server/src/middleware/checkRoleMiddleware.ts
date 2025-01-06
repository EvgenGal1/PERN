// middleware по добав.нов.устройство только ADMIN, +декодер,валид.

import { NextFunction } from 'express';

// подкл.обраб.ошиб.
// import { UnauthorizedError, BadRequest } from '../error/vr/ApiErrorJS';
// import validateAccessToken from '../services/token.service';
import TokenService from '../services/token.service';
import AppError from '../middleware/errors/ApiError';

// экспорт fn принимающая Роль (вызов fn с передачей Роли и возврат.middleware)
export default function (role /* : Array<T> */ : string[]) {
  // возвращ. сам middleware
  return function (
    req: any /* Request */,
    res: any /* Response */,
    next: NextFunction,
  ) {
    // ~ console.log("role ", role); // [ 'SUPER', 'ADMIN', 'MODER' ]
    if (req.method === 'OPTIONS') {
      next();
    }
    try {
      // провер header на наличие поля authorization
      const authorizationHeader = req.headers.authorization;
      if (!authorizationHeader) {
        return AppError.unauthorized('Требуется авторизация (authoriz undf)');
      }
      // достаём токен из header (отделяя от Типа`Носитель` передающ по ind 0) из шапки(обычн.там токен)
      const accessToken = authorizationHeader.split(' ')[1]; // Bearer asfasnfkajsfnjk..
      if (!accessToken) {
        return AppError.unauthorized('Токен err' /* , `${e}` */);
        // return res.status(401).json({ message: "Не авторизован" });
      }

      // проверка валидации
      // const decoded = jwt.verify(token, process.env.SECRET_KEY);
      // req.id = decoded.id;
      const decoded = TokenService.validateAccessToken(accessToken);
      if (!decoded) {
        return AppError.unauthorized('Токен не валид' /* , `${e}` */);
      }

      // раскодир.токен.`проверять`на валидность. const опред.с др.именем т.к. role уже есть. получ.масс.Ролей
      // const { role: userRoles } = jwt.verify(token, process.env.SECRET_KEY);
      const { role: userRoles } = TokenService.validateAccessToken(accessToken);
      // ~ console.log("userRoles ", userRoles); // от польз. ~ USER
      if (!userRoles) {
        return AppError.unauthorized('НЕТ РОЛИ' /* , `${e}` */);
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
        return AppError.badRequest(
          `Нет доступа у Роли ${decoded.role} или ошб.Ролей`,
        );
      }

      req.user = decoded;
      next();
    } catch (e) {
      // res.status(401).json({ message: `Не авторизован. Ошибка ${e}` });
      throw AppError.unauthorized(`! ${e}`);
    }
  };
}
