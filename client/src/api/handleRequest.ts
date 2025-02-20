// ^ обработчик API запросов к БД

import { AxiosResponse } from "axios";

// кэш
// import { queryCache } from "../utils/cache";
// обраб.ошб.
import { errorHandler } from "@/utils/errorHandler";

/**
 * Обрабатывает API-запросы, автоматически обрабатывая ошибки
 * @param method - Метод возвращающий Promise с Axios-ответом
 * @param context - Контекст для логирования (название метода)
 */
export const handleRequest = async <T>(
  method: () => Promise<AxiosResponse<T>>,
  context: string = "Unknown"
  // cacheKey?: string,
  // ttl: number = 60_000
): Promise<T> => {
  // обраб.req/ошб.
  try {
    // кэш проверка/возврат
    // if (cacheKey) {
    //   const cached = queryCache.get<T>(cacheKey);
    //   if (cached) return cached;
    // }
    // вызов мтд.
    const response = await method();
    const result = response.data;
    // кэш запись
    // if (cacheKey) queryCache.set(cacheKey, result, ttl);
    console.debug(`^ [${context}] RES: `, result);
    // возврат данн.
    return result;
  } catch (error) {
    // кэш удал.запись по регул.выраж.ключей
    // if (cacheKey) queryCache.invalidate(new RegExp(cacheKey));
    // обраб.ошб.
    const processedError = errorHandler(error, context);
    // логг.ошб.с контекстом
    // logger.error(error);
    console.error(`! [${context}] ОШБ: `, processedError);
    // выброс.ошб.
    throw processedError;
  }
};
