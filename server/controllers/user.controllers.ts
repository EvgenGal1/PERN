// ^^ fn|запросы по взаимодейств.с польз.

// от ошб.повтор.объяв.перем в блоке
export {};

// ^ ++++ UlbiTV. NPg
// подкл.конфиг.БД для записи получ.данн.в БД
// const db = require("../db");
const { pool } = require("../db");
// подкл. библ. для шифрование пароля нов.польз.
const bcrypt = require("bcryptjs");
// подкл. валидацию
const { validationResult } = require("express-validator");

// ^ ++++ UlbiTV.PERNstore и EvGen
// подкл.обраб.ошиб.
const ApiError = require("../error/ApiError");
// подкл.модели пользователей. Можно разнести на отдельн.ф(User.js,Role.js,..)
const { User } = require("../models/modelsTS.ts");
const UserService = require("../services/user.service.ts");

// обьяв.кл.(для компановки) с неск.мтд
class UserControllers {
  // ^ ++++ UlbiTV. NPg
  // async созд.польз. по SQL запросу ВСТАВКИ, /* валидации, шифр.пароля, */ проверками
  async createUserNPg(req, res) {
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
      const { name, surname, email, password } = req.body;

      // получ.по email
      const candidateEml = await pool.query(
        `SELECT * FROM person WHERE email = $1`,
        [email]
      );
      // проверка существ.email по совпад.ключ и значен. е/и польз.есть - возвращ.Ответ в смс ошб.
      if (candidateEml.rows[0]) {
        return res.status(400).json({ message: `Email <${email}> уже есть.` });
      }
      const candidateName = await pool.query(
        `SELECT * FROM person WHERE name = $1`,
        [name]
      );
      if (candidateName.rows[0]) {
        return res.status(400).json({ message: `Имя ${name} уже занято.` });
      }

      // `ждём` hashирование/шифрование пароля ч/з bcryptjs. 1ый пароль, 2ой степень шифр.
      // const salt = await bcrypt.getSalt(12);
      const hashedPassword = await bcrypt.hash(password, 12 /* salt */);

      // async созд.польз. с пропис.SQL запроса(вставки,табл.с полями,значен.перем.,возврат к польз.после созд., + масс.перем.)
      const newPerson = await pool.query(
        `INSERT INTO person (name, surname, email, psw) VALUES ($1, $2, $3, $4) RETURNING *`,
        // `INSERT INTO person (name, surname, email) VALUES ($1, $2, $3) RETURNING *`,
        [name, surname, email, hashedPassword]
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
  async getUserNPg(req, res) {
    try {
      const allUser = await pool.query(`SELECT * FROM person`);
      // возвращ. весь массив
      res.json(allUser.rows);
    } catch (error) {}
  }

  // async ПОЛУЧЕНИЯ по ID с SQL
  async getOneUserNPg(req, res) {
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
  async updateUserNPg(req, res) {
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
  async deleteUserNPg(req, res) {
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

  // ^ ++++ EvGen
  async getAllUserPERN(req, res, next) {
    try {
      const users = await UserService.getAllUserPERN();
      return res.json(users);
    } catch (error) {
      next(`НЕ удалось получить пользователей - ${error}.`);
    }
  }

  async getOneUserPERN(req, res, next) {
    try {
      const { id } = req.params;
      if (!id) {
        return next(ApiError.internal(`ID не передан`));
      }
      const userId = await UserService.getOneUserPERN(id);
      return res.json(userId);
    } catch (error) {
      next(`НЕ нашлось по ID - ${error}.`);
    }
  }

  async updateUserPERN(req, res, next) {
    try {
      const { id, username, email, password, role, isActivated } = req.body;
      if (!username) {
        return next(ApiError.internal(`Имя не передано`));
      }
      const userUpd = await UserService.updateUserPERN(
        id,
        username,
        email,
        password,
        role,
        isActivated
      );
      return res.json(userUpd);
    } catch (error) {
      next(`НЕ обновлён - ${error}.`);
    }
  }

  async deleteUserPERN(req, res, next) {
    try {
      const { id } = req.params;
      if (!id) {
        return next(ApiError.internal(`ID не передан`));
      }
      const delUser = await UserService.deleteUserPERN(id);
      return res.json(delUser);
    } catch (error) {
      next(`НЕ удалён - ${error}.`);
    }
  }
}

// экспорт объ.кл.
module.exports = new UserControllers();
