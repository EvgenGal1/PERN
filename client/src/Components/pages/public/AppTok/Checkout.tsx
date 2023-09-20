// ^ `Проверить`
import { useState, useContext, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { Container, Form, Button, Spinner } from "react-bootstrap";

import { AppContext } from "../../../layout/AppTok/AppContext";
import { fetchBasket } from "../../../../http/Tok/basketAPI_Tok";
import { checkUser as checkAuth } from "../../../../http/Tok/userAPI_Tok";
import { userCreate, guestCreate } from "../../../../http/Tok/orderAPI_Tok";
import { BASKET_ROUTE } from "../../../../utils/consts";

interface CheckoutFormValues {
  name: string;
  email: string;
  phone: string;
  address: string;
}

interface CheckoutFormValidation {
  name: string | boolean | null | undefined;
  email: string | boolean | null | undefined;
  phone: string | boolean | null | undefined;
  address: string | boolean | null | undefined;
}

const isValid = (input: HTMLInputElement) => {
  let pattern;
  switch (input.name) {
    case "name":
      pattern = /^[-а-я]|[a-z0-9._%+-]{2,}( [-а-я]|[a-z0-9._%+-]{2,}){1,2}$/i;
      return pattern.test(input.value.trim());
    case "email":
      pattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+.{1,2}[a-z]+$/i;
      return pattern.test(input.value.trim());
    case "phone":
      pattern = /^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$/i;
      return pattern.test(input.value.trim());
    case "address":
      return input.value.trim() !== "";
  }
};

const Checkout = () => {
  // Авториз.Корзин. Логика проверки авторизован ли пользователь и есть ли товары в корзине
  // ! врем.получ. и в NavBar и в Checkout. Позже перепишется на получ.в App
  const { user, basket }: any = useContext(AppContext);
  // loader, пока получаем корзину
  const [fetching, setFetching] = useState(true);

  // Заказ. Логика заказа
  const [order, setOrder] = useState(null);

  const [value, setValue] = useState<CheckoutFormValues>({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [valid, setValid] = useState<CheckoutFormValidation>({
    name: null,
    email: null,
    phone: null,
    address: null,
  });

  // Авториз.Корзин.
  useEffect(() => {
    // если корзина пуста, здесь делать нечего
    fetchBasket()
      .then((data) => {
        console.log("Checkout fetchBasket data ", data);
        basket.products = data.products;
      })
      .finally(() => setFetching(false));
    // нужно знать, авторизован ли пользователь
    checkAuth()
      .then((data) => {
        console.log("Checkout checkAuth data ", data);
        if (data) {
          user.login(data);
        }
      })
      .catch((error) => user.logout());
  }, []);

  // Авториз.Корзин. loader, пока получаем корзину
  if (fetching) {
    return <Spinner animation="border" />;
  }

  // Заказ. Заказ был успешно оформлен
  if (order) {
    return (
      <Container>
        <h1 className="mb-4 mt-4">Заказ оформлен</h1>
        <p>Наш менеджер скоро позвонит для уточнения деталей.</p>
      </Container>
    );
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue({ ...value, [event.target.name]: event.target.value });
    /*
     * Вообще говоря, проверять данные поля, пока пользователь не закончил ввод — неправильно, проверять надо в момент потери фокуса. Но приходится проверять здесь, поскольку браузеры автоматически заполняют поля. И отловить это событие — весьма проблематичная задача.
     */
    setValid({
      ...valid,
      [event.target.name]: isValid(event.target),
    });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setValue({
      name: (
        event.currentTarget.elements.namedItem("name") as HTMLInputElement
      ).value.trim(),
      email: (
        event.currentTarget.elements.namedItem("email") as HTMLInputElement
      ).value.trim(),
      phone: (
        event.currentTarget.elements.namedItem("phone") as HTMLInputElement
      ).value.trim(),
      address: (
        event.currentTarget.elements.namedItem("address") as HTMLInputElement
      ).value.trim(),
    });

    setValid({
      name: isValid(
        event.currentTarget.elements.namedItem("name") as HTMLInputElement
      ),
      email: isValid(
        event.currentTarget.elements.namedItem("email") as HTMLInputElement
      ),
      phone: isValid(
        event.currentTarget.elements.namedItem("phone") as HTMLInputElement
      ),
      address: isValid(
        event.currentTarget.elements.namedItem("address") as HTMLInputElement
      ),
    });

    // е/и форма заполнена правильно, можно отправлять данные
    if (valid.name && valid.email && valid.phone && valid.address) {
      // Заказ.
      // Свойство "comment" не существует в типе "EventTarget".
      // let comment: any = event.target.comment.value.trim();
      // правка от ИИ
      let comment: any = (
        event.currentTarget.elements.namedItem("comment") as HTMLInputElement
      ).value.trim();
      comment = comment ? comment : null;
      // форма заполнена правильно, можно отправлять данные
      const body = { ...value, comment };
      const create = user.isAuth ? userCreate : guestCreate;
      create(body).then((data) => {
        setOrder(data);
        basket.products = [];
      });
    }
  };
  return (
    <Container>
      {/* Авториз.Корзин. Если корзина пуста — пользователь будет направлен на страницу корзины, где увидит сообщение «Ваша корзина пуста». После того, как заказ был создан, переменная order изменяет свое значение — и пользователь увидит сообщение, что заказ успешно оформлен. */}
      {basket.count === 0 && <Navigate to={BASKET_ROUTE} replace={true} />}
      {/*  */}
      <h1 className="mb-4 mt-4">Оформление заказа</h1>
      <Form noValidate onSubmit={handleSubmit}>
        <Form.Control
          name="name"
          value={value.name}
          // onChange={(e) => handleChange(e)}
          onChange={handleChange}
          isValid={valid.name === true}
          isInvalid={valid.name === false}
          placeholder="Введите имя и фамилию..."
          className="mb-3"
        />
        <Form.Control
          name="email"
          value={value.email}
          // ! ошб. - Аргумент типа "ChangeEvent<FormControlElement>" нельзя назначить параметру типа "ChangeEvent<HTMLInputElement>".
          // ! ошб. - Тип "FormControlElement" не может быть назначен для типа "HTMLInputElement".
          // ! ошб. - В типе "HTMLTextAreaElement" отсутствуют следующие свойства из типа "HTMLInputElement": accept, align, alt, capture и еще 27
          // onChange={(e) => handleChange(e)}
          onChange={handleChange}
          isValid={valid.email === true}
          isInvalid={valid.email === false}
          placeholder="Введите адрес почты..."
          className="mb-3"
        />
        <Form.Control
          name="phone"
          value={value.phone}
          // onChange={(e) => handleChange(e)}
          onChange={handleChange}
          isValid={valid.phone === true}
          isInvalid={valid.phone === false}
          placeholder="Введите номер телефона..."
          className="mb-3"
        />
        <Form.Control
          name="address"
          value={value.address}
          // onChange={(e) => handleChange(e)}
          onChange={handleChange}
          isValid={valid.address === true}
          isInvalid={valid.address === false}
          placeholder="Введите адрес доставки..."
          className="mb-3"
        />
        <Form.Control
          name="comment"
          className="mb-3"
          placeholder="Комментарий к заказу..."
        />
        <Button type="submit" variant="primary" className="btn-primary--eg">
          Отправить
        </Button>
      </Form>
    </Container>
  );
};

export default Checkout;
