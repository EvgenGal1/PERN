// ^ обработчик API запросов к БД

import { AxiosResponse } from "axios";

// обраб.ошб.
import { errorHandler } from "@/utils/errorHandler";
// кэш
import { requestCache } from "@/utils/cache";

/**
 * Обрабатывает API-запросы, автоматически обрабатывая ошибки
 * @param method - Метод возвращающий Promise с Axios-ответом
 * @param context - Контекст для логирования (название метода)
 * @param options - КЭШ
 * @returns
 */
export const handleRequest = async <T>(
  method: () => Promise<AxiosResponse<T>>,
  context: string = "Unknown",
  // кэш
  options: {
    cacheKey?: string; // ключ кэша
    ttl?: number; // вр.жизни (мс)
    useCache?: boolean; // управ.кэшем
    // invalidateCache?: boolean; // Принудительное обновление
  } = {}
): Promise<T> => {
  const { cacheKey, ttl = 30000, useCache = true } = options;

  // проверка кэша
  if (useCache && cacheKey) {
    const cached = requestCache.get<T>(cacheKey);
    if (cached) {
      console.debug(`[${context}] КЭШ выбил `, cacheKey);
      return cached;
    }
  }

  // обраб.req/ошб.
  try {
    // вызов мтд.
    const response = await method();
    const result = response.data;

    // сохр.кэш данн.
    if (useCache && cacheKey) {
      requestCache.set(cacheKey, result, ttl);
      console.debug(`[${context}] Cache SET for`, cacheKey);
    }

    console.debug(`^ [${context}] RES: `, result);
    // возврат данн.
    return result;
  } catch (error) {
    // очистка кэша при ошб.
    if (cacheKey) requestCache.delete(cacheKey);

    // обраб.ошб.
    const processedError = errorHandler(error, context);
    // логг.ошб.с контекстом
    // logger.error(error);
    console.error(`! [${context}] ОШБ: `, processedError);
    // выброс.ошб.
    throw processedError;
  }
};
