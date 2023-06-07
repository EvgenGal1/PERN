import AppError from "../error/ApiError";
import OrderService from "../services/order.service";
import BasketService from "../services/basket.service";
import UserService from "../services/user.service";

class Order {
  adminCreate = async (req, res, next) => {
    console.log("SRV ordCntrl adminCreat 1 : " + 1);
    console.log("SRV ordCntrl adminCreat req : " + req);
    await this.create(req, res, next, "admin");
  };

  userCreate = async (req, res, next) => {
    console.log("SRV ordCntrl userCreat 1 : " + 1);
    console.log("SRV ordCntrl userCreat req : " + req);
    await this.create(req, res, next, "user");
  };

  guestCreate = async (req, res, next) => {
    console.log("SRV ordCntrl guestCreat 1 : " + 1);
    console.log("SRV ordCntrl guestCreat req : " + req);
    await this.create(req, res, next, "guest");
  };

  async create(req, res, next, type) {
    console.log("SRV ordCntrl create Creat 1 : " + 1);
    console.log("SRV ordCntrl create req : " + req);
    console.log("SRV ordCntrl create type : " + type);
    // console.log(req);
    console.log(type);
    try {
      const { name, email, phone, address, comment = null } = req.body;
      console.log("SRV ordCntrl create req.body : " + req.body);
      console.log(req.body);
      // данные для создания заказа
      if (!name) throw new Error("Не указано имя покупателя");
      if (!email) throw new Error("Не указан email покупателя");
      if (!phone) throw new Error("Не указан телефон покупателя");
      if (!address) throw new Error("Не указан адрес доставки");

      let items,
        userId = null;
      console.log("SRV ordCntrl create items 1: " + items);
      console.log(items);
      if (type === "admin") {
        console.log("SRV ordCntrl create IF ELSE 11 : " + 11);
        // когда заказ делает админ, id пользователя и состав заказа в теле запроса
        if (!req.body.items) throw new Error("Не указан состав заказа");
        if (req.body.items.length === 0)
          throw new Error("Не указан состав заказа");
        items = req.body.items;
        // проверяем существование пользователя
        userId = req.body.userId ?? null;
        if (userId) {
          await UserService.getOne(userId); // будет исключение, если не найден
        }
      } else {
        console.log("SRV ordCntrl create ELSE IF 22 : " + 22);
        // когда заказ делает обычный пользователь (авторизованный или нет), состав заказа получаем из корзины, а id пользователя из req.auth.id (если есть)
        if (!req.signedCookies.basketId) {
          console.log(
            "SRV ordCntrl create IF !req.signedCookies.basketId 1 : " + 1
          );
          throw new Error("Ваша корзина пуста");
        }
        const basket = await BasketService.getOne(
          parseInt(req.signedCookies.basketId)
        );
        console.log("SRV ordCntrl create basket : " + basket);
        console.log("SRV ordCntrl create basket.products : " + basket.products);
        console.log(basket.products);
        if (basket.products.length === 0) {
          console.log("SRV ordCntrl create IF basket.products.length 1 : " + 1);
          throw new Error("Ваша корзина пуста");
        }
        items = basket.products;
        console.log("SRV ordCntrl create items 2 : " + items);
        console.log(items);
        userId = req.auth?.id ?? null;
        console.log("SRV ordCntrl create userId : " + userId);
        console.log(userId);
      }

      // все готово, можно создавать
      const order = await OrderService.create({
        name,
        email,
        phone,
        address,
        comment,
        items,
        userId,
      });
      console.log("SRV ordCntrl create order : " + order);
      console.log(order);
      console.log("SRV ordCntrl create order.items : " + order.items);
      console.log(order.items);

      // корзину теперь нужно очистить
      await BasketService.clear(parseInt(req.signedCookies.basketId));
      res.json(order);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  async adminGetAll(req, res, next) {
    try {
      const orders = await OrderService.getAll();
      res.json(orders);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  async adminGetUser(req, res, next) {
    try {
      if (!req.params.id) {
        throw new Error("Не указан id пользователя");
      }
      const order = await OrderService.getAll(req.params.id);
      res.json(order);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  async adminGetOne(req, res, next) {
    try {
      if (!req.params.id) {
        throw new Error("Не указан id заказа");
      }
      const order = await OrderService.getOne(req.params.id);
      res.json(order);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  async adminDelete(req, res, next) {
    try {
      if (!req.params.id) {
        throw new Error("Не указан id заказа");
      }
      const order = await OrderService.delete(req.params.id);
      res.json(order);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  async userGetAll(req, res, next) {
    try {
      const orders = await OrderService.getAll(req.auth.id);
      res.json(orders);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  async userGetOne(req, res, next) {
    try {
      if (!req.params.id) {
        throw new Error("Не указан id заказа");
      }
      const order = await OrderService.getOne(req.params.id, req.auth.id);
      res.json(order);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }
}

export default new Order();
