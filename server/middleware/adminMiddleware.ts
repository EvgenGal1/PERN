// ^ проверка Роли ADMIN для доп.прав
import { Request, Response, NextFunction } from "express";

import AppError from "../error/ApiError";
import { DecodedToken /* , CustomRequest */ } from "../types/DecodedToken";

// ! ошб. - Свойство "role" не существует в типе "DecodedToken"
// ^ объявил в authMiddleware
// interface DecodedToken {
//   role: string;
//   // добавьте другие свойства, если они есть в вашем токене
// }
// ! ошб. - Последовательные объявления свойств должны иметь один и тот же тип. Свойство "auth" должно иметь тип "DecodedToken", но имеет здесь тип "DecodedToken"
// ^ объявил в authMiddleware
// declare global {
//   namespace Express {
//     interface Request {
//       auth?: DecodedToken;
//     }
//   }
// }

// ^ объедин.interface
// interface DecodedToken {
//   role: string;
// }
interface CustomRequest extends Request {
  auth?: DecodedToken;
}

const admin = (req: CustomRequest, res: Response, next: NextFunction): void => {
  try {
    if (req.auth?.role !== "ADMIN") {
      throw new Error("Только для администратора");
    }
    next();
  } catch (e) {
    next(AppError.forbidden(e.message));
  }
};

export default admin;
