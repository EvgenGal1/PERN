import { AxiosError } from "axios";

/**
 * универсальный обработчик ошибок TS
 * @param error - Ошб.любого типа - Error, Axios, unknown, кастом
 * @returns объ.с унифицир.структурой - { message?, status?, code? }
 */
export function errorHandleUniversal(error: unknown): {
  message?: string;
  status?: number;
  code?: string;
} {
  // проверка на null/undefined и базовый тип
  if (!error || typeof error !== "object") {
    return { message: "Неизвестная ошибка" };
  }
  // значения по умолчанию
  let message = "Ошибка сервера";
  let status: number | undefined;
  let code: string | undefined;

  // обраб.стандарт.ошб.JS Error
  if (error instanceof Error) {
    message = error.message || message;
  }

  // обраб.ошб. AxiosError
  if (error instanceof AxiosError) {
    message = error.response?.data?.message || error.message || message;
    status = error.response?.status;
    code = error.code;
  }
  // обраб. Статуса
  if ("status" in error && typeof error.status === "number") {
    status = error.status;
  }
  // обраб.с Смс
  if ("message" in error && typeof error.message === "string") {
    message = error.message;
  }
  // обраб. Кода ошб.
  if ("code" in error && typeof error.code === "string") {
    code = error.code;
  }
  return { message, status, code };
}

/**
 * проверка Cтруктуры Ошибки
 * @param error - Ошибка
 * @param targetStatus - Статус (опционально)
 */
export function isErrorWithStatus(
  error: unknown,
  targetStatus?: number
): error is Error | AxiosError | { status: number } {
  // проверка базовой структуры
  if (typeof error !== "object" || error === null) return false;
  // проверка конкретных случаев
  const isStatusMatch =
    "status" in error &&
    typeof error.status === "number" &&
    (targetStatus === undefined || error.status === targetStatus);
  return isStatusMatch || error instanceof Error || error instanceof AxiosError;
}
