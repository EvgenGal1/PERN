// ^ Service(Бизнес логика - БД и выход.парам.(НЕ req,res))

// от ошб.повтор.объяв.перем в блоке
export {};

// ^ ++++ UlbiTV.PERNstore
// подкл.модели пользователей и ролей. Можно разнести на отдельн.ф(User.ts,Role.ts,..)
// Путь импорта может закончиться только расширением .ts '.
const { User } = require("../models/modelsTS.ts");
// подкл. библ. для шифрование пароля нов.польз.
const bcrypt = require("bcryptjs");
// подкл.генир.уник.рандом.id
const uuid = require("uuid");
// подкл.обраб.ошиб.
const ApiErrorJS = require("../error/ApiErrorJS");
// выборка полей
const UserDto = require("../dtos/user.dto.ts");
// serv
const MailService = require("./mail.service.ts");
const TokenService = require("./token.service.ts");

class AuthService {
  // РЕГИСТРАЦИЯ
  async registration(
    username: string,
    email: string,
    password: string
    // role: string
  ) {
    // базов.логика с обраб.ошб.
    try {
      // ^ UlbiTV. NPg
      // проверка сущест.username и email
      // const candidate = await User.findOne({
      //   where: { username, email },
      // });
      // if (candidate) {
      //   return ApiErrorJS.BadRequest(
      //     `Пользователь ${username} <${email}> уже существует`
      //   );
      //   // return next(ApiErrorJS.BadRequest(`Пользователь уже существует`));
      //   // throw new Error(`Пользователь уже существует`);
      // }
      const userName = await User.findOne({ where: { username } });
      if (userName) {
        console.log("SRV.a.serv registr userName : " + username);
        // ! ошб. выводит username и падает в undf reading 'refr|tokens'
        /* throw */ /* return */ ApiErrorJS.BadRequest(
          `Пользователь с Именем ${username} уже существует`
        );
        return;
      }
      console.log("SRV.a.serv registr userName > eml : " + username, email);
      const eml = await User.findOne({ where: { email } });
      if (eml) {
        return ApiErrorJS.BadRequest(
          `Пользователь с Email <${email}> уже существует`
        );
      }

      console.log("7777777777777777777777777777 : " + 7);
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
        // role,
        // fullName,
        // avatarUrl,
      });
      console.log("88888888888888888888888 : " + 8);
      // отпр.смс на почту для актив-ии (кому,полн.путь ссылки)
      await MailService.sendActionMail(
        email,
        // activationLink // `${process.env.API_URL}/PERN/auth/activate/${activationLink}`
        activationLinkPath
      );
      console.log("999999999999999999999999999999 : " + 9);
      // ^ надо отдельн.fn ниже - выборка,генер.2токен,сохр.refresh в БД, return
      // выборка полей(~3шт.) для FRONT (new - созд.экземпляр класса)
      const userDto = new UserDto(user);

      // созд./получ. 2 токена. Разворач.нов.объ.
      console.log("++++++++++++++++++++++++++++1 : " + userDto);
      const tokens = TokenService.generateToken({ ...userDto });

      // сохр.refresh в БД
      await TokenService.saveToken(userDto.id, tokens.refreshToken);

      // возвращ.2 токена, инфо о польз.
      return {
        activationLinkPath,
        message: `Пользователь ${username} <${email}> создан и зарегистрирован. ID_${user.id}_${user.role}`,
        tokens: tokens,
        user: userDto,
      };
    } catch (error) {
      // общ.отв. на серв.ошб. в json смс
      // res.status(500).json({message:`Не удалось зарегистрироваться - ${error}.`});
      return ApiErrorJS.BadRequest(`НЕ удалось зарегистрироваться - ${error}.`);
    }
  }

  // АВТОРИЗАЦИЯ
  async login(username: string, email: string, password: string) {
    try {
      console.log("SRV. a.S.l : " + 1);
      // ^ улучшить до общей проверки (!eml.email - так висит)
      // проверка сущест.username и email
      const user = await User.findOne({ where: { username /* email */ } });
      console.log("SRV. a.S.l user : " + "user");
      if (!user /* !user.username */ /* || !== username */) {
        console.log("SRV. a.S.l uS : " + "здесь user null");
        return ApiErrorJS.BadRequest(
          `Пользователь с Именем ${username} не найден`
        );
        console.log("после BadRequest : " + "после BadRequest");
        return;
      }
      console.log("SRV. a.S.l : " + 1.1);
      const eml = await User.findOne({ where: { email } });
      console.log("SRV. a.S.l eml : " + eml);
      if (!eml /* !eml.email */) {
        console.log("SRV. a.S.l uS : " + "здесь 2 eml null");
        return ApiErrorJS.BadRequest(
          `Пользователь с Email <${email}> не найден`
        );
      }
      console.log("SRV. usDTO a.S.l : " + 2);
      // проверка `сравнивания` пароля с шифрованым
      let comparePassword = bcrypt.compareSync(password, user.password);
      if (!comparePassword) {
        console.log("SRV. usDTO PSW : " + "eRRorrr");
        return ApiErrorJS.BadRequest("Указан неверный пароль");
      }
      console.log("SRV. usDTO : " + 3);

      // ^ надо отдельн.fn ниже - выборка,генер.2токен,сохр.refresh в БД, return
      const userDto = new UserDto(user);
      console.log("SRV. usDTO : " + userDto);
      const tokens = TokenService.generateToken({ ...userDto });
      console.log("SRV. 2 : " + tokens.refreshToken);
      await TokenService.saveToken(userDto.id, tokens.refreshToken);
      return {
        message: `Зашёл ${username} <${email}>. ID_${user.id}_${user.role}`,
        tokens: tokens,
        user: userDto,
      };
    } catch (error) {
      return ApiErrorJS.BadRequest(`НЕ удалось войти - ${error}.`);
    }
  }

  // ВЫХОД. Удален.refreshToken из БД ч/з token.serv
  async logout(refreshToken: string, username: string, email: string) {
    // пров.переданого токена
    if (!refreshToken) {
      // return "Токен не передан";
      return ApiErrorJS.BadRequest(
        `Токен от ${username} <${email}> не передан`
      );
    }
    const token = await TokenService.removeToken(refreshToken);
    return `Токен ${refreshToken} пользователя ${username} <${email}> удалён. Стат ${token}`;
  }

  // АКТИВАЦИЯ АКАУНТА. приним.ссылку актив.us из БД
  async activate(activationLink: string) {
    const user = await User.findOne({
      where: { activationLink: activationLink },
    });
    if (!user) {
      return ApiErrorJS.BadRequest(
        `Некорр ссы.актив. Пользователя НЕ существует`
      );
    }
    // флаг в true и сохр.
    user.isActivated = true;
    /* await */ user.save();
    // } catch (error) {
    //   return next(
    //     ApiErrorJS.BadRequest(`НЕ удалось зарегистрироваться - ${error}.`)
    //   );
    // }
  }

  // ПЕРЕЗАПИСЬ ACCESS|REFRESH токен. Отправ.refresh, получ.access и refresh
  async refresh(refreshToken: string /* , username: string, email: string */) {
    // е/и нет то ошб.не авториз
    if (!refreshToken) {
      // return ApiErrorJS.UnauthorizedError();
      return ApiErrorJS.UnauthorizedError();
    }
    // валид.токен.refresh
    const userData = TokenService.validateRefreshToken(refreshToken);
    console.log("===============a.S.rf userData : " + userData);
    console.log(userData);
    // поиск токена
    const tokenFromDB = await TokenService.findToken(refreshToken);
    console.log(tokenFromDB);
    // проверка валид и поиск
    if (!userData || !tokenFromDB) {
      console.log("---------------a.S.rf err : " + "err");
      return ApiErrorJS.UnauthorizedError();
    }
    // вытаск.польз.с БД по ID
    const user = await User.findByPk(userData.id); // findByld
    // ^ надо отдельн.fn ниже - выборка,генер.2токен,сохр.refresh в БД, return
    const userDto = new UserDto(user);
    const tokens = TokenService.generateToken({ ...userDto });
    console.log("---------------a.S.rf tokens.rf : " + tokens.refreshToken);
    await TokenService.saveToken(userDto.id, tokens.refreshToken);
    return {
      message: `ПЕРЕЗАПИСЬ ${userDto.username} <${userDto.email}>. ID_${user.id}_${user.role}`,
      tokens: tokens,
      user: userDto,
    };
  }

  // ~ врем.из User.contrl,serv Получ.всех польз.
  async getAllUsers() {
    const users = await User.findAll(); // findAndCountAll
    return users;
  }

  // ПРОВЕРКА авторизации польз.(генер.нов.токет и отправ.на клиента(постоянная перезапись при использ.)) // ^ удалить, разобрать или уровнять с login / refresh
  // async check(req, res, next) {
  //   // res.json({ message: "Раб cgeck" });
  //   const token = generateJwt(
  //     req.user.id,
  //     req.user.username,
  //     req.user.email,
  //     req.user.role
  //   );
  //   return res.json({
  //     token,
  //     message: `Проверен ${req.user.username} <${req.user.email}>. id${req.user.id}_${req.user.role}`,
  //   });
}

module.exports = new AuthService();
