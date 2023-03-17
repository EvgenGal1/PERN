// middlware по обраб.ошб.

// от ошб.повтор.объяв.перем в блоке
// export {};
// An import path can only end with a '.ts' extension when 'allowImportingTsExtensions' is enabled.

import { Request, Response, NextFunction } from "express";

// подкл.обраб.ошиб.
import ApiErrorTS from "../error/ApiErrorTS";

// экспорт fn (fn явл.middlware). приним. ошб.,запр.,отв.,след.(передача управ.след.middlware)
/* export default */ const errorHandlerMW = function (
  err: ApiErrorTS,
  req: Request,
  res: Response,
  next: NextFunction
): Response {
  console.log("err" + err);

  // е/и ошб.явл.экземплярром из ApiErrorJS, возвращ.код, смс из ошб., масс.ошб.
  if (err instanceof ApiErrorTS) {
    console.log("????????????????????????? err 1 ", err);
    return res.status(err.status).json({ message: err.message });
    // .json({ message: err.message, errors: err.errors });
    // .json(err)
  }
  console.log("????????????????????????? err 2 ", err);
  // е/и ошб. НЕ из ApiErrorJS, возвращ.настр.код и смс
  return res.status(505).json({ message: `Непредвиденная ошибка! ${err}` });
}; /* errorHandlerMW */

export default errorHandlerMW;
