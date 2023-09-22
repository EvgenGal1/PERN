import AppError from "../error/ApiError";

const ErrorHandler = (err, req, res, next) => {
  // ! врем.откл. от ошб.со stat=500(самый нижний return). Разобраться почему err нет (`случай`) в AppError
  // if (err instanceof AppError) {
  return res
    .status(err.status)
    .json({ message: err.message, errors: err.errors });
  // }
  return res
    .status(500)
    .json({ message: "Непредвиденная ошибка ОПЯТЬ", errors: err?.errors });
};

export default ErrorHandler;
