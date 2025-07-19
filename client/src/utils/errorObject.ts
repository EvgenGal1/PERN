import { AxiosError } from "axios";

/**
 * проверка структуры Ошибки
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
