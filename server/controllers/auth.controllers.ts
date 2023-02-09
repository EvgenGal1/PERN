// от ошб. перем/блок
export {};
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
const { User } = require("../models/modelsTS.ts");

const AuthService = require("../services/auth.service.ts");
const cookie = require("cookie");

// fn генер.токена + Роль(по умолч.присвойка из User). по. Порядок - формат с fronta, back генер.,возвращ.токен, сохр на front(coocki,LS), front вход.на auth(в header добав.токен), back валид.по секрет.key
const generateJwt = (
  id: number,
  username: string,
  email: string /* , role */
) => {
  // подписываем передан.парам.
  return jwt.sign(
    // payload(центр.часть токена) данн.польз.
    { id, username, email /* , role */ },
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
        // return res.status(400).json({
        return next(
          ApiError.BadRequest(
            /* message: */ "Некорректые данные при регистрации",
            /* errors: */ errorsValid.array()
            // })
          )
        );
      }

      // Получ.из тела.
      // ^ Роль второстепена(не прописана), приним.из запрос. для созд.отдельно польз.и админов
      const { id, username, email, password /* , role */ } = req.body;

      // проверка отсутств.user.
      if (!username) {
        return next(ApiError.BadRequest(`Некорректный username`));
      }
      // ? нужно Доп.проверка отсутств email,psw е/и errorsValid не отраб
      if (!email) {
        return next(ApiError.BadRequest(`Некорректный email`));
      }
      if (!password) {
        return next(ApiError.BadRequest(`Некорректный password`));
      }

      // передача данн.в fn для Service (возвращ.2 токена, данн.польз.,есть,создан.)
      const userData = await AuthService.registration(
        username,
        email,
        password
        // role
      );

      // сохр.refresh в cookах (ключ.сохр., refresh токен, опц.:вр.хран.,не возмж.измен.в браузере,(https - secure:true; false для Postman))
      res.cookie("refreshToken", userData.tokens.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });

      // возвращ.токен и инфо о польз.
      return res.json(userData);
    } catch (error) {
      // общ.отв. на серв.ошб. в json смс
      // res.status(500).json({message:`Не удалось зарегистрироваться - ${error}.`});
      // return next(
      next(
        // ApiError.BadRequest(
        `НЕ удалось зарегистрироваться (registr) - ${error}.`
        // error
        // )
      );
    }
  }

  // АВТОРИЗАЦИЯ
  async login(req, res, next) {
    try {
      const errorsValid = validationResult(req);
      if (!errorsValid.isEmpty()) {
        return next(
          ApiError.BadRequest(
            "Некорректые данные при регистрации",
            errorsValid.array()
          )
        );
      }
      const { username, email, password } = req.body;
      const userData = await AuthService.login(username, email, password);
      res.cookie("refreshToken", userData.tokens.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });

      return res.json(userData);
    } catch (error) {
      next(error);
    }
  }

  // ВЫХОД. Удал.Cookie.refreshToken
  async logout(req, res, next) {
    try {
      // получ refresh из cookie, передача в service, удал.обоих, возвращ.200|token
      const { refreshToken } = req.cookies;
      const { username, email } = req.body;
      const token = await AuthService.logout(refreshToken, username, email);
      res.clearCookie("refreshToken");
      return res.json(token);
    } catch (error) {
      next(`НЕ удалось ВЫЙТИ - ${error}.`);
    }
  }

  // АКТИВАЦИЯ АКАУНТА. По ссылке в почту
  async activate(req, res, next) {
    try {
      // из стр.получ.ссы.актив.
      const activationLink = req.params.link;
      await AuthService.activate(activationLink);
      // редирект на FRONT после перехода по ссылки (изза разных hostов BACK)
      return res.redirect(process.env.CLIENT_URL);
    } catch (error) {
      // return
      next(
        // ApiError.BadRequest(
        // console.log("error ", error)
        `НЕ удалось АКТИВАВИРАВАТЬ (activate) - ${error}.`
        // )
      );
    }
  }

  // ПЕРЕЗАПИСЬ ACCESS токен. Отправ.refresh, получ.access и refresh
  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      // const { username, email } = req.body;
      const userData = await AuthService.refresh(
        refreshToken /* , username, email */
      );
      res.cookie("refreshToken", userData.tokens.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      // return res.json(username, email);
      return res.json(userData /* , username, email */);
    } catch (error) {
      // return
      next(
        // ApiError.BadRequest(
        `НЕ удалось ПЕРЕЗАПИСАТЬ (refresh) - ${error}.`
        // )
      );
    }
  }

  // ПРОВЕРКА авторизации польз.(генер.нов.токет и отправ.на клиента(постоянная перезапись при использ.))
  async check(req, res, next) {
    // res.json({ message: "Раб cgeck" });
    const token = generateJwt(
      req.user.id,
      req.user.username,
      req.user.email
      // req.user.role
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

  // ~ врем.из User.contrl,serv Получ.всех польз.
  async getAllUsers(req, res, next) {
    try {
      const users = await AuthService.getAllUsers();
      return res.json(users);
    } catch (error) {
      next(`НЕ удалось получить пользователей - ${error}.`);
    }
  }
}

// экспорт объ.кл.
module.exports = new AuthControllers();
