// ^ общ.мтд.валидации данн.из req

import ApiError from '../middleware/errors/ApiError';

// валидация ID
export function parseId(id: number | string, entityName: string): number {
  console.log('id : ', id, typeof id);
  if (id === undefined) {
    throw ApiError.badRequest(`ID '${entityName}' не передан`);
  }
  const parsedId = +id;
  if (isNaN(parsedId)) {
    throw ApiError.badRequest(`Некорректный ID '${entityName}'`);
  }
  return parsedId;
}

// валидация названия (name)
export function validateName(body: any, entityName: string): { name: string } {
  if (!body) {
    throw ApiError.badRequest(`Не передано тело запроса для '${entityName}'`);
  }
  const { name } = body;
  if (!name || typeof name !== 'string') {
    throw ApiError.badRequest(
      `Название '${entityName}' обязательно и должно быть строкой`,
    );
  }
  return { name };
}

// валидация тела запроса
export function validateData(body: any, entityName: string): void {
  if (!body || Object.keys(body).length === 0) {
    throw ApiError.badRequest(`Нет данных для обработки '${entityName}'`);
  }
}

// валидация числовых параметров запроса (limit, page)
export function parseQueryParam(
  param: string | string[] | undefined | any,
  defaultValue: number,
  paramName?: string,
): number {
  if (param === undefined) {
    return defaultValue;
  }
  if (typeof param !== 'string' || !/[0-9]+/.test(param)) {
    if (paramName) {
      console.warn(
        `Некорректное значение параметра '${paramName}'. Используется значение по умолчанию: '${defaultValue}'`,
      );
    }
    return defaultValue;
  }
  return Math.max(1, Number(param));
}
