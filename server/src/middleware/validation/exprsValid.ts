// ^ спец.настр.валидации > eml/psw

import { body } from 'express-validator';

// масс. middleware для валидации. `Проверка`(чего,ошб.).валидатор(на email) | ~кастом - проверка(чего).условие.смс ошб.
// ^ парам.: str.конкатенация пути с /api/auth, масс.валид., fn логики(асинхр,Запрос,Ответ)
// ! врем.откл. в Postman приходят ошб. на пароль когда его даже нет в ~модели запроса
export const exprsValid = [
  body('email', 'Некорректый email').isEmail(),
  // ^ парам.: str.конкатенация пути с /api/auth, масс.валид., fn логики(асинхр,Запрос,Ответ)
  // ! врем.откл. в Postman приходят ошб. на пароль когда его даже нет в ~модели запроса
  body('password')
    // .not()
    .isIn(['123', '12345', 'password123', 'god123', 'qwerty123', '123qwerty'])
    .withMessage('Не используйте обычные значения в качестве пароля')
    .isLength({ min: 6 })
    .withMessage('Минимальная длина пароля 6 символов')
    .matches(/\d/)
    .withMessage('Пароль должен содержать число'),
];
