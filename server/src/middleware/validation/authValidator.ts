import { body } from 'express-validator';

export const validateSignup = [
  body('email', 'Некорректый email').isEmail().normalizeEmail(),
  body('password')
    .not()
    .isIn([
      '123qwe',
      '123qwerty',
      'qwerty',
      'qwe123',
      'qwerty123',
      '123456',
      'password123',
      'god123',
      '123qwe!@#',
      '123!@#qwe',
      '!@#123qwe',
      '!@#qwe123',
      'qwe!@#123',
      'qwe123!@#',
      '123Qwe!@#',
      '123!@#Qwe',
      '!@#123Qwe',
      '!@#Qwe123',
      'Qwe!@#123',
      'Qwe123!@#',
    ])
    .withMessage('Не используйте обычные значения в качестве пароля')
    .isLength({ min: 6 })
    .withMessage('Минимальная длина пароля 6 символов')
    .isLength({ max: 32 })
    .withMessage('Максимальная длина пароля 32 символа')
    .matches(/\d/)
    .withMessage('Пароль должен содержать число')
    .matches(/(?=(.*\W){2})/)
    .withMessage('Нужны 2 специальных символа'),
];
