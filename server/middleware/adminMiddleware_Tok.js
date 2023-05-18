// ^ проверка Роли ADMIN для доп.прав
import AppError from "../error/AppError_Tok.js";

const admin = (req, res, next) => {
  try {
    if (req.auth.role !== "ADMIN") {
      throw new Error("Только для администратора");
    }
    next();
  } catch (e) {
    next(AppError.forbidden(e.message));
  }
};

export default admin;
