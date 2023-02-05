// ^ Service(Бизнес логика - БД и выход.парам.(НЕ req,res))

// подкл.обраб.ошиб.
const ApiError = require("../error/ApiError.js");
// подкл.модели пользователей и ролей. Можно разнести на отдельн.ф(User.js,Role.js,..)
const { Type } = require("../models/models.js");

// fn генер.токена + Роль(по умолч.присвойка из User). по. Порядок - формат с fronta, back генер.,возвращ.токен, сохр на front(coocki,LS), front вход.на auth(в header добав.токен), back валид.по секрет.key
const generateJwt = (id, username, email, role) => {
  // подписываем передан.парам.
  return jwt.sign(
    // payload(центр.часть токена) данн.польз.
    { id, username, email, role },
    // проверка валид.ч/з секрет.ключ(в перем.окруж.)
    process.env.SECRET_KEY,
    // опции
    {
      // вр.раб.токена
      expiresIn: "24h",
    }
  );
};

class AuthService {
  // РЕГИСТРАЦИЯ
  async create(name) {
    // базов.логика с обраб.ошб.
    try {
      const typeVerif = await Type.findOne({
        where: { name },
      });
      if (typeVerif) {
        return ApiError.BadRequest(`Тип ${name} уже существует`); // throw не раб
      }
      const type = await Type.create({ name });
      return {
        type,
        message: `Тип ${name} создан.`,
      };
    } catch (error) {
      return ApiError.BadRequest(`Ошибка создания - ${error}.`);
    }
  }

  // АВТОРИЗАЦИЯ
  async login(username, email, password) {
    try {
      // ^ улучшить до общей проверки (!eml.email - так висит)
      // проверка сущест.username и email
      const user = await User.findOne({ where: { username /* email */ } });
      if (!user /* !user.username */ /* || !== username */) {
        return ApiError.BadRequest(
          `Пользователь с Именем ${username} не найден`
        );
      }
      const eml = await User.findOne({ where: { email } });
      if (!eml /* !eml.email */) {
        return ApiError.BadRequest(`Пользователь с Email <${email}> не найден`);
      }

      // проверка `сравнивания` пароля с шифрованым
      let comparePassword = bcrypt.compareSync(password, user.password);
      if (!comparePassword) {
        return ApiError.BadRequest("Указан неверный пароль");
      }

      // ^ надо отдельн. fn - выборка,генер.2токен,сохр.refresh в БД, return
      const userDto = new UserDto(user);
      const tokens = TokenService.generateToken({ ...userDto });
      await TokenService.saveToken(userDto.id, tokens.refreshToken);
      return {
        ...tokens,
        user: userDto,
        message: `Зашёл ${username} <${email}>. ID_${user.id}_${user.role}`,
      };
    } catch (error) {
      return ApiError.BadRequest(`НЕ удалось войти - ${error}.`);
    }
  }

  // ПРОВЕРКА авторизации польз.(генер.нов.токет и отправ.на клиента(постоянная перезапись при использ.))
  async check(req, res, next) {
    // res.json({ message: "Раб cgeck" });
    const token = generateJwt(
      req.user.id,
      req.user.username,
      req.user.email,
      req.user.role
    );
    return res.json({
      token,
      message: `Проверен ${req.user.username} <${req.user.email}>. id${req.user.id}_${req.user.role}`,
    });
  }
}

module.exports = new AuthService();
