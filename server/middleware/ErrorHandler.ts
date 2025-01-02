// ^ общий обработчик ошибок

import AppError from '../error/ApiError';

const ErrorHandler = (err, req, res, next) => {
  // ошб. часть AppError
  if (err instanceof AppError) {
    return res.status(err.status).json({
      status: err.status,
      message: err.message,
      errors: err.errors || null,
    });
  }

  console.error(err);

  // обраб.др.ошб.
  return res.status(500).json({
    message: 'Непредвиденная ошибка ОПЯТЬ',
    errors: err?.errors || null,
  });
};

export default ErrorHandler;
