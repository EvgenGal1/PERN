// ^ подтвержд.личности ч/з JWT-токена полученый либо после регистрации, либо после входа в личный кабинет
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import AppError from "../error/ApiError";
// ! ошб. - Свойство "authorization" не существует в типе "Headers"
import { DecodedToken /*, CustomRequest */ } from "../types/DecodedToken";

// Определите свойства, которые вы ожидаете получить из токена
// interface DecodedToken {
//   id?: string;
//   role?: string;
// }
// declare global {
//   namespace Express {
//     interface Request {
//       auth?: DecodedToken;
//     }
//   }
// }

// ^ объедин.interface
// interface DecodedToken {
//   id: string;
// }
interface CustomRequest extends Request {
  auth?: DecodedToken;
}

const auth = (req: CustomRequest, res: Response, next: NextFunction): void => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // Bearer token
    if (!token) {
      throw new Error("Требуется авторизация");
    }
    const decoded = jwt.verify(token, process.env.SECRET_KEY) as DecodedToken;
    req.auth = decoded;
    next();
  } catch (e) {
    next(AppError.forbidden(e.message));
  }
};

export default auth;
