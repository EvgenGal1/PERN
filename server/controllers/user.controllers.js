// fn|запросы по взаимодейств.с польз.

// ^ ++++ UlbiTV. NPg
// подкл.конфиг.БД для записи получ.данн.в БД
// const db = require("../db");
const { pool } = require("../db");
// подкл. библ. для шифрование пароля нов.польз.
const bcrypt = require("bcryptjs");
// подкл. валидацию
const { validationResult } = require("express-validator");

// ^ ++++ UlbiTV.PERNstore
// подкл.ф.контролера для генерац.web токена
const jwt = require("jsonwebtoken");
// подкл.обраб.ошиб.
const ApiError = require("../error/ApiError");
// подкл.модели пользователей и ролей. Можно разнести на отдельн.ф(User.js,Role.js,..)
const { User, Backet } = require("../models/models");

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

// обьяв.кл.(для компановки) с неск.мтд
class UserControllers {
  // ^ ++++ UlbiTV. NPg
  // async созд.польз. по SQL запросу ВСТАВКИ, /* валидации, шифр.пароля, */ проверками
  async createUser(req, res) {
    // базов.логика с обраб.ошб.
    try {
      // проверка вход.полей на валидацию
      const errorsValid = validationResult(req);
      // е/и проверка не прошла(не пусто) - возвращ.Ответ на front смс ошб.(кастомизируем) + errors.масс.
      if (!errorsValid.isEmpty()) {
        return res.status(400).json({
          message: "Некорректые данные при регистрации",
          errors: errorsValid.array(),
        });
      }

      // получ.данн.с fronta
      const { name, surname, email /* , password */ } = req.body;
      // console.log(name, surname); // тест2

      // // проверка существ.email по совпад.ключ и значен.
      // const candidate = await User.findOne({ email });
      // // е/и польз.есть - возвращ.Ответ в смс ошб.
      // if (candidate) {
      //   return res
      //     .status(400)
      //     .json({ message: `Такой пользователь уже есть - ${candidate}.` });
      // }

      // `ждём` hashирование/шифрование пароля ч/з bcryptjs. 1ый пароль, 2ой степень шифр.
      // const salt = await bcrypt.getSalt(12);
      // const hashedPassword = await bcrypt.hash(password, 12 /* salt */);

      // async созд.польз. с пропис.SQL запроса(вставки,табл.с полями,значен.перем.,возврат к польз.после созд., + масс.перем.)
      const newPerson = await pool.query(
        // `INSERT INTO person (name, surname, email, psw) VALUES ($1, $2, $3, $4) RETURNING *`,
        `INSERT INTO person (name, surname, email) VALUES ($1, $2, $3) RETURNING *`,
        [name, surname, email /* , password */ /* hashedPassword */]
      );
      // res.json(`Создан пользователь ${name} ${surname}.`); // тест2
      // возвращ.только польз.(rows) на front
      res.json(newPerson.rows[0]);
    } catch (error) {
      const { name, surname, email /* , password */ } = req.body;
      // общ.отв. на серв.ошб. в json смс
      res.status(500).json({
        // , ${password}
        message: `Не удалось зарегистрироваться - ${error}. ${name}, ${surname}, ${email}`,
      });
    }
  }

  // async возрат всех польз. с SQL запросом ПОЛУЧЕНИЯ ВСЕХ
  async getUser(req, res) {
    try {
      const allUser = await pool.query(`SELECT * FROM person`);
      // возвращ. весь массив
      res.json(allUser.rows);
    } catch (error) {}
  }

  // async ПОЛУЧЕНИЯ по ID с SQL
  async getOneUser(req, res) {
    try {
      // из парам.запр.получ.id
      const id = req.params.id;
      // получ.по id
      const idUser = await pool.query(`SELECT * FROM person WHERE id = $1`, [
        id,
      ]);
      // возвращ.только польз.(rows) на клиента
      res.json(idUser.rows[0]);
    } catch (error) {}
  }

  // async ОБНОВЛЕНИЯ данн.польз. с SQL
  async updateUser(req, res) {
    try {
      // получ.все данн.с fronta
      const { id, name, surname, email /* , password */ } = req.body;
      // измен.поля, возвращ.т.к. UPDATE этого не делает
      const updUser = await pool.query(
        `UPDATE person set name = $1, surname = $2, email = $3 WHERE id = $4 RETURNING *`,
        [name, surname, email, id /* , password */ /* hashedPassword */]
      );
      // возвращ.только польз.(rows) на front
      res.json(updUser.rows[0]);
    } catch (error) {}
  }

  // async УДАЛЕНИЕ данн.польз. с SQL
  async deleteUser(req, res) {
    try {
      // из парам.запр.получ.id
      const id = req.params.id;
      const { name, surname, email /* , password */ } = req.body;
      // удал.по id
      const idUser = await pool.query(`DELETE FROM person WHERE id = $1`, [id]);
      // возвращ.только польз.(rows) на клиента
      // res.json(idUser.rows[0]);
      // ИЛИ сообщ. что удалён
      res.json(`Пользователь удалён  ${name} ${surname}.`);
    } catch (error) {}
  }

  // ^ ++++ UlbiTV.PERNstore
  async registration(req, res, next) {
    // базов.логика с обраб.ошб.
    try {
      // проверка вход.полей на валидацию
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

      // проверка отсутств.email и psw с возврат.ошб.
      if (!email || !password || !username) {
        return next(ApiError.badRequest("Некорректный email или password"));
      }
      // проверка сущест.email
      const candidate = await User.findOne({ where: { email } });
      if (candidate) {
        return next(
          ApiError.badRequest(`Пользователь с email ${email} уже существует`)
        );
      }

      // hashирование/шифрование пароля ч/з bcryptjs. 1ый пароль, 2ой степень шифр.
      // const salt = await bcrypt.getSalt(12);
      const hashPassword = await bcrypt.hash(password, 5);

      // СОЗД.НОВ.ПОЛЬЗОВАТЕЛЯ (пароль совпад.с шифрованым)
      const user = await User.create({
        username,
        email,
        role,
        password: hashPassword,
        // fullName,
        // avatarUrl,
      });
      // СОЗД.КАРЗИНУ. id можно получ.из СОЗД.НОВ.ПОЛЬЗ
      const basket = await Backet.create({ userId: user.id });

      // передаём данн.польз в fn генер.токена. и получ.роли на front(в fn по умолч.передаётся из User)
      const token = generateJwt(user.id, user.username, user.email, user.role);

      // возвращ.токен
      return res.json({ token });
    } catch (error) {
      // общ.отв. на серв.ошб. в json смс
      // res
      //   .status(500)
      //   .json({ message: `Не удалось зарегистрироваться - ${error}.` });
      return next(
        ApiError.badRequest(`НЕ удалось зарегистрироваться - ${error}.`)
      );
    }
  }

  async login(req, res, next) {
    //   const { email, password } = req.body;
    //   const user = await User.findOne({ where: { email } });
    //   if (!user) {
    //     return next(ApiError.internal("Пользователь не найден"));
    //   }
    //   let comparePassword = bcrypt.compareSync(password, user.password);
    //   if (!comparePassword) {
    //     return next(ApiError.internal("Указан неверный пароль"));
    //   }
    //   const token = generateJwt(user.id, user.email, user.role);
    //   return res.json({ token });
  }

  // проверка авторизации польз.
  async check(req, res, next) {
    //   const token = generateJwt(req.user.id, req.user.email, req.user.role);
    //   return res.json({ token });

    // ? здесь? универс.обраб.ошиб.(handler).

    // Из стр.запроса получ.парам.стр.и отправ обрат.на польз.
    // res.json("asdf");
    const query = req.query;
    // тест4 - http://localhost:5007/PERN/user/auth без id не пройдёт (`плохой запрос`)
    if (!query.id) {
      return next(ApiError.badRequest("Не задан ID"));
    }
    res.json(query);
  }
}

// экспорт объ.кл.
module.exports = new UserControllers();
