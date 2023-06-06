import AppError from "../error/AppError_Tok.js";
// import AppError from "../error/ApiError";
// const AppError = require("../error/ApiError");

const ErrorHandler = (err, req, res, next) => {
  if (err instanceof AppError) {
    return res.status(err.status).json({ message: err.message });
  }
  return res.status(500).json({ message: "Непредвиденная ошибка" });
};

export default ErrorHandler;
// module.exports = { ErrorHandler };
