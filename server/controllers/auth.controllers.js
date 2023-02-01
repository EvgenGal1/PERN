// ^ ++++ UlbiTV.PERNstore
// подкл.ф.контролера для генерац.web токена
const jwt = require("jsonwebtoken");
// подкл. библ. для шифрование пароля нов.польз.
const bcrypt = require("bcryptjs");
// подкл. валидацию
const { validationResult } = require("express-validator");
// подкл.обраб.ошиб.
const ApiError = require("../error/ApiError.js");
// подкл.модели пользователей и ролей. Можно разнести на отдельн.ф(User.js,Role.js,..)
const { User, Backet } = require("../models/models.js");

const AuthService = require("../services/auth.service.js");
const cookie = require("cookie");

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

class AuthControllers {
  // ^ ++++ UlbiTV.PERNstore
  // РЕГИСТРАЦИЯ
  async registration(req, res, next) {
    // базов.логика с обраб.ошб.
    try {
      // проверка вход.полей на валидацию // ^ UlbiTV. NPg
      const errorsValid = validationResult(req);
      // е/и проверка не прошла(не пусто) - возвращ.Ответ на front смс ошб.(кастомизируем) + errors.масс.
      if (!errorsValid.isEmpty()) {
        return res.status(400).json({
          message: "Некорректые данные при регистрации",
          errors: errorsValid.array(),
        });
      }

      // Получ.из тела.
      // ^ Роль второстепена(не прописана), приним.из запрос. для созд.отдельно польз.и админов
      const { id, username, email, password, role } = req.body;

      // проверка отсутств.user.
      if (!username) {
        return next(ApiError.badRequest(`Некорректный username`));
      }
      // ? нужно Доп.проверка отсутств email,psw е/и errorsValid не отраб
      if (!email) {
        return next(ApiError.badRequest(`Некорректный email`));
      }
      if (!password) {
        return next(ApiError.badRequest(`Некорректный password`));
      }

      // передача данн.в fn для Service (возвращ.2 токена, данн.польз.,есть,создан.)
      const userData = await AuthService.registration(
        username,
        email,
        password
        // role
      );

      // сохр.refresh в cookах (ключ.сохр., refresh токен, опц.:вр.хран.,не возмж.измен.в браузере,(https - secure:true))
      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        // maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true,
        // secure: true - secure: false для Postman
        // secure: false,
        // sameSite: "none",
      });

      // возвращ.токен и инфо о польз.
      return res.json(
        // {
        userData
        // message: `Пользователь ${username} <${email}> создан и зарегистрирован`,
        // }
      );
    } catch (error) {
      // общ.отв. на серв.ошб. в json смс
      // res.status(500).json({message:`Не удалось зарегистрироваться - ${error}.`});
      return next(
        ApiError.badRequest(
          `НЕ удалось зарегистрироваться (registr) - ${error}.`
        )
      );
    }
  }

  // АВТОРИЗАЦИЯ
  async login(req, res, next) {
    try {
      // проверка вход.полей на валидацию // ^ UlbiTV. NPg
      const errorsValid = validationResult(req);
      // е/и проверка не прошла(не `пусто`) - возвращ.Ответ на front смс ошб.(кастомизируем) + errors.масс.
      if (!errorsValid.isEmpty()) {
        return res.status(400).json({
          message: "Некорректые данные при регистрации",
          errors: errorsValid.array(),
        });
      }

      const { username, email, password } = req.body;

      // ^ улучшить до общей проверки (!eml.email - так висит)
      // проверка сущест.username и email
      const user = await User.findOne({ where: { username /* email */ } });
      if (!user /* !user.username */ /* || !== username */) {
        return next(
          ApiError.internal(`Пользователь с Именем ${username} не найден`)
        );
      }
      const eml = await User.findOne({ where: { email } });
      if (!eml /* !eml.email */) {
        return next(
          ApiError.internal(`Пользователь с Email <${email}> не найден`)
        );
      }
      // проверка `сравнивания` пароля с шифрованым
      let comparePassword = bcrypt.compareSync(password, user.password);
      if (!comparePassword) {
        return next(ApiError.internal("Указан неверный пароль"));
      }
      const token = generateJwt(user.id, user.username, user.email, user.role);
      return res.json({
        token,
        message: `Зашёл ${username} <${email}>. ID_${user.id}-${user.role}`,
      });
    } catch (error) {}
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
    //   return next(ApiError.badRequest("Не задан ID"));
    // }
    // res.json(query);
  }

  // ВЫХОД. Удален.Token.refreshToken
  async logout(req, res, next) {
    try {
      res.json(["123", "456"]);
    } catch (error) {
      return next(
        ApiError.badRequest(`НЕ удалось зарегистрироваться - ${error}.`)
      );
    }
  }

  // АКТИВАЦИЯ АКАУНТА. По ссылке в почту
  async activate(req, res, next) {
    try {
      // из стр.получ.ссы.актив.
      const activationLink = req.params.Link;
      await AuthService.activate(activationLink);
      // редирект после перехода по ссылки
      return res.redirect(process.env.CLIENT_URL);
    } catch (error) {
      return next(
        ApiError.badRequest(
          // console.log("error ", error)
          `НЕ удалось зарегистрироваться (activate) - ${error}.`
        )
      );
    }
  }

  // ПЕРЕЗАПИСЬ ACCESS токен. Отправ.refresh, получ.access и refresh
  async refresh(req, res, next) {
    try {
    } catch (error) {
      return next(
        ApiError.badRequest(
          `НЕ удалось зарегистрироваться (refresh) - ${error}.`
        )
      );
    }
  }
}

// экспорт объ.кл.
module.exports = new AuthControllers();
