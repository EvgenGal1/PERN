import request from 'supertest';
import jwt from 'jsonwebtoken';

// подкл.приложение/сервисы
import app from '../index';
import UserService from '../services/user.service';

// мокает сервис > изоляц.от БД
jest.mock('../services/user.service');

describe('GET /api/user/getone/:id', () => {
  // перед каждым тестом
  beforeEach(() => {
    jest.clearAllMocks(); // очистка моки
  });

  // секрет > подписи Токена
  const secretKey = `${process.env.SECRET_KEY}`;
  // cозд. фейковый токен с ролью admin
  const fakeToken = jwt.sign({ userId: 1, role: 'admin' }, secretKey, {
    expiresIn: '1h',
  });
  // структура Пользователя
  const mockUser = {
    id: 1,
    username: 'testuser',
    email: 'test@example.com',
    isActivated: true,
    activationLink: '',
    createdAt: '2022-01-01T00:00:00Z',
    updatedAt: '2022-01-01T00:00:00Z',
  };
  // ID Пользователя, которого нет в БД
  const moreUser = 999;

  it('GET_getone/1 вернёт данные Пользователя', async () => {
    (UserService.getOneUser as jest.Mock).mockResolvedValue(mockUser); // мокает успешный ответ getOneUser к jest.Mock

    const res = await request(app)
      .get('/api/user/getone/1')
      .set('Authorization', `Bearer ${fakeToken}`) // + заголовок авторизации
      .set('Cache-Control', 'no-cache'); // + заголовок от кеширования

    // проверка статус ответа
    expect(res.status).toBe(200); // примитив
    expect(res.status).toEqual(200); // глубок.сравн.

    // проверка структуры
    expect(res.body).toEqual(expect.objectContaining(mockUser));
  });

  it(`GET_getone/${moreUser} вернёт 404 если Пользователя нет`, async () => {
    (UserService.getOneUser as jest.Mock).mockResolvedValue(null); // мокает ответ что пользователя нет

    const res = await request(app)
      .get(`/api/user/getone/${moreUser}`)
      .set('Authorization', `Bearer ${fakeToken}`);
    expect(res.status).toEqual(404);
    expect(res.body).toEqual({
      message: `Пользователь по id ${moreUser} не найден в БД`,
      errors: null,
      status: 404,
    });
  });

  it('GET_getone/ вернёт ошибку при сбое службы', async () => {
    (UserService.getOneUser as jest.Mock).mockRejectedValue(
      new Error('Database error'),
    ); // мокает ошибку сервиса

    const res = await request(app)
      .get('/api/user/getone/1')
      .set('Authorization', `Bearer ${fakeToken}`);

    expect(res.status).toEqual(500);
    expect(res.body).toEqual({
      message: `Ошибка при получении пользователя`,
      errors: null,
      status: 500,
    });
  });
});
