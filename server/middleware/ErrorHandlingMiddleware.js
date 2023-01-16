// подкл.обраб.ошиб.
const ApiError = require("../error/ApiError");

// экспорт fn (fn явл.middlware). приним. ошб.,запр.,отв.,след.(передача управ.след.middlware)
module.exports = function (err, req, res, next) {
  // е/и ошб.из ApiError, возвращ.код и смс из ошб.
  if (err instanceof ApiError) {
    return res.status(err.status).json({ message: err.message });
  }
  // е/и ошб. НЕ из ApiError, возвращ.настр.код и смс
  return res.status(500).json({ message: "Непредвиденная ошибка!" });
};
