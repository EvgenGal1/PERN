// ^ Service(Бизнес логика - БД и выход.парам.(НЕ req,res))

// подкл.конфиг.БД для записи получ.данн.в БД
const { pool } = require("../db");
const FileService = require("./file.service.js");

// ^ ++++ UlbiTV.PERNstore
// подкл.ф.контролера для генерац.web токена
const jwt = require("jsonwebtoken");
// подкл.генир.уник.рандом.id
const uuid = require("uuid");
// подкл.для созд.пути
const path = require("path");
// подкл. библ. для шифрование пароля нов.польз.
const bcrypt = require("bcryptjs");
// подкл. валидацию
const { validationResult } = require("express-validator");
// подкл.обраб.ошиб.
const ApiError = require("../error/ApiError.js");
// подкл.модели пользователей и ролей. Можно разнести на отдельн.ф(User.js,Role.js,..)
const { User } = require("../models/models.js");

const MailService = require("./mail.service.js");
const TokenService = require("./token.service.js");
const UserDto = require("../dtos/user.dto.js");
// const { where } = require("sequelize");

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
  async registration(username, email, password, role) {
    // базов.логика с обраб.ошб.
    try {
      // ^ UlbiTV. NPg
      // проверка сущест.username и email
      const candidate = await User.findOne({
        where: { username, email },
      });

      if (candidate) {
        return ApiError.BadRequest(
          `Пользователь ${username} <${email}> уже существует`
        );
        // return next(ApiError.BadRequest(`Пользователь уже существует`));
        // throw new Error(`Пользователь уже существует`);
      }

      // hashирование(не шифрование) пароля ч/з bcryptjs. 1ый пароль, 2ой степень шифр.
      // const salt = await bcrypt.getSalt(12); | hashSync
      const hashPassword = await bcrypt.hash(password, 5); // hashSync

      // генер.уник.ссылку активации ч/з fn v4(подтверждение акаунта)
      let activationLink = uuid.v4();
      let activationLinkPath = `${process.env.API_URL}/PERN/auth/activate/${activationLink}`;

      // СОЗД.НОВ.ПОЛЬЗОВАТЕЛЯ (пароль совпад.с шифрованым)
      const user = await User.create({
        username,
        email,
        password: hashPassword,
        activationLink,
        role,
        // fullName,
        // avatarUrl,
      });

      // отпр.смс на почту для актив-ии (кому,полн.путь ссылки)
      await MailService.sendActionMail(
        email,
        // activationLink // `${process.env.API_URL}/PERN/auth/activate/${activationLink}`
        activationLinkPath
      );

      // ^ надо отдельн. fn - выборка,генер.2токен,сохр.refresh в БД, return
      // выборка полей(3шт.) для FRONT (new - созд.экземпляр класса)
      const userDto = new UserDto(user);

      // созд./получ. 2 токена. Разворач.нов.объ.
      const tokens = TokenService.generateToken({ ...userDto });

      // сохр.refresh в БД
      await TokenService.saveToken(userDto.id, tokens.refreshToken);

      // возвращ.2 токена, инфо о польз.
      return {
        ...tokens,
        activationLinkPath,
        user: userDto,
        message: `Пользователь ${username} <${email}> создан и зарегистрирован. ID_${user.id}_${user.role}`,
      };
    } catch (error) {
      // общ.отв. на серв.ошб. в json смс
      // res.status(500).json({message:`Не удалось зарегистрироваться - ${error}.`});
      return ApiError.BadRequest(`НЕ удалось зарегистрироваться - ${error}.`);
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

  // ВЫХОД. Удален.refreshToken из БД ч/з token.serv
  async logout(refreshToken, username, email) {
    // пров.переданого токена
    if (!refreshToken) {
      // return "Токен не передан";
      return ApiError.BadRequest(`Токен от ${username} <${email}> не передан`);
    }
    const token = await TokenService.removeToken(refreshToken);
    return `Токен пользователя ${username} <${email}> удалён. Стат ${token}`;
  }

  // АКТИВАЦИЯ АКАУНТА. приним.ссылку актив.us из БД
  async activate(activationLink) {
    const user = await User.findOne({
      where: { activationLink: activationLink },
    });
    if (!user) {
      return ApiError.BadRequest(
        `Некорр ссы.актив. Пользователя НЕ существует`
      );
    }
    // флаг в tru и сохр.
    user.isActivated = true;
    /* await */ user.save();
    // } catch (error) {
    //   return next(
    //     ApiError.BadRequest(`НЕ удалось зарегистрироваться - ${error}.`)
    //   );
    // }
  }

  // ПЕРЕЗАПИСЬ ACCESS токен. Отправ.refresh, получ.access и refresh
  async refresh(refreshToken, username, email) {
    // е/и нет то ошб.не авториз
    if (!refreshToken) {
      // return ApiError.UnauthorizedError();
      return ApiError.UnauthorizedError(`${username} <${email}>`);
    }
    // валид.токен.refresh
    const userData = TokenService.validateRefreshToken(refreshToken);
    // поиск токена
    const tokenFromDB = await TokenService.findToken(refreshToken);
    // проверка валид и поиск
    if (!userData || !tokenFromDB) {
      throw ApiError.UnauthorizedError();
    }
    // вытаск.польз.с БД по ID
    // const user = await User.findByld(userData.id);
    const user = await User.findByPk(userData.id);
    // ^ надо отдельн. fn - выборка,генер.2токен,сохр.refresh в БД, return
    const userDto = new UserDto(user);
    const tokens = TokenService.generateToken({ ...userDto });
    await TokenService.saveToken(userDto.id, tokens.refreshToken);
    return {
      ...tokens,
      user: userDto,
      message: `ПЕРЕЗАПИСЬ ${userDto.username} <${userDto.email}>. ID_${user.id}_${user.role}`,
    };
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

    // ? здесь? универс.обраб.ошиб.(handler).
    // Из стр.запроса получ.парам.стр.и отправ обрат.на польз.
    // res.json("asdf");
    // const query = req.query;
    // тест4 - http://localhost:5007/PERN/user/auth без id не пройдёт (`плохой запрос`)
    // if (!query.id) {
    //   return next(ApiError.BadRequest("Не задан ID"));
    // }
    // res.json(query);
  }
}

module.exports = new AuthService();
