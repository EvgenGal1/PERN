// middlware по обраб.ошб.

// от ошб.повтор.объяв.перем в блоке
// export {};

// подкл.обраб.ошиб.
const ApiErrorJS = require("../error/ApiErrorJS");

// экспорт fn (fn явл.middlware). приним. ошб.,запр.,отв.,след.(передача управ.след.middlware)
module.exports = function (err, req, res, next) {
  console.log("SRV.ErrHandlMW - " + err);

  // е/и ошб.явл.экземплярром из ApiErrorJS, возвращ.код, смс из ошб., масс.ошб.
  if (err instanceof ApiErrorJS) {
    console.log("????????????????????????? err 1 ", err);
    return (
      res
        .status(err.status)
        // .json(err)
        .json({ message: err.message /* , errors: err.errors */ })
    );
  }
  console.log("????????????????????????? err 2 ", err);
  // е/и ошб. НЕ из ApiErrorJS, возвращ.настр.код и смс
  return res
    .status(505)
    .json({
      message: `(~SRV.ErrHandlMW) Непредвиденная ошибка! + err: ${err}`,
    });
};
