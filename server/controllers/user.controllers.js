// fn|запросы по взаимодейств.с польз.

// подкл.конфиг.БД для записи получ.данн.в БД
const db = require("../db");
// // подкл.модели пользователей и ролей
// const User = require("../models/User");
// const Role = require("../models/Role");
// подкл. библ. для шифрование пароля нов.польз.
const bcrypt = require("bcryptjs");
// подкл. валидацию
const { validationResult } = require("express-validator");

// обьяв.кл.(для компановки) с неск.мтд
class UserControllers {
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
      const newPerson = await db.query(
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
      const allUser = await db.query(`SELECT * FROM person`);
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
      const idUser = await db.query(`SELECT * FROM person WHERE id = $1`, [id]);
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
      const updUser = await db.query(
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
      const idUser = await db.query(`DELETE FROM person WHERE id = $1`, [id]);
      // возвращ.только польз.(rows) на клиента
      // res.json(idUser.rows[0]);
      // ИЛИ сообщ. что удалён
      res.json(`Пользователь удалён  ${name} ${surname}.`);
    } catch (error) {}
  }
}

// экспорт объ.кл.
module.exports = new UserControllers();
