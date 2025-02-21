// ^ обработчик API запросов к БД

import { AxiosResponse } from "axios";

// обраб.ошб.
import { errorHandler } from "@/utils/errorHandler";
// кэш // import { queryCache } from "../utils/cache"; | const requestCache = new Map<string, any>();

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
    // кэш проверка/возврат закешир.результат
    // if (cacheKey) {
    //   const cached =   queryCache.get<T>(cacheKey) | requestCache.has(cacheKey)
    //   if (cached)   return cached | requestCache.get(cacheKey)
    // }
    // вызов мтд.
    const response = await method();
    const result = response.data;
    // кэш сохр.данн.
    // if (cacheKey)   queryCache.set(cacheKey, result, ttl) | requestCache.set(cacheKey, result)
    console.debug(`^ [${context}] RES: `, result);
    // возврат данн.
    return result;
  } catch (error) {
    // кэш удал.данн.
    // if (cacheKey)   queryCache.invalidate(new RegExp(cacheKey)) | requestCache.delete(cacheKey)
    // обраб.ошб.
    const processedError = errorHandler(error, context);
    // логг.ошб.с контекстом
    // logger.error(error);
    console.error(`! [${context}] ОШБ: `, processedError);
    // выброс.ошб.
    throw processedError;
  }
};
