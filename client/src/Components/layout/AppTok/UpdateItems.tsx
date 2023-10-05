// ^ доп.модальн.окно редактирование Позиций Заказа
import { Form } from "react-bootstrap";
import uuid from "react-uuid";

const UpdateItems = (props: any) => {
  // получ.от родителя масс. хар-тик и fn измен.масс.
  const { items, setItems } = props;

  const append = () => {
    setItems([
      ...items,
      {
        id: null,
        name: null,
        price: null,
        quantity: null,
        unique: uuid(),
        append: true,
      },
    ]);
  };
  // новую хар-ку надо просто удалить из массива items, а старую — оставить, но изменить remove на true, чтобы потом выполнить http-запрос на сервер для удаления
  const remove = (unique: any) => {
    const item = items.find((elem: any) => elem.unique === unique);
    if (item.id) {
      // старая хар-ка
      setItems(
        items.map((elem: any) =>
          elem.unique === unique
            ? { ...elem, change: false, remove: true }
            : elem
        )
      );
    } else {
      // новая хар-ка
      setItems(items.filter((elem: any) => elem.unique === unique));
    }
  };
  const change = (key: any, value: any, unique: any) => {
    setItems(
      items.map((item: any) =>
        item.unique === unique
          ? { ...item, [key]: value, change: !item.append }
          : item
      )
    );
  };

  return (
    <>
      {/* <h5>Позиции</h5> */}
      {items.map((item: any) => (
        <div
          key={item.unique}
          className="df df-row df-jcsb"
          style={{ display: item.remove ? "none" : "flex" }}
        >
          <div className="df df-col">
            <Form.Control
              name={"name_" + item.unique}
              value={item.name}
              onChange={(e) => change("name", e.target.value, item.unique)}
              placeholder="Имя..."
            />
          </div>
          <div className="df df-col">
            <Form.Control
              name={"price_" + item.unique}
              value={item.price}
              // ! попытка перевести в номер. не раб
              // value={Number(item.price)}
              onChange={(e) =>
                change("price", Number(e.target.value), item.unique)
              }
              placeholder="Цена..."
            />
          </div>
          <div className="df df-col">
            <Form.Control
              name={"quantity_" + item.unique}
              value={item.quantity}
              onChange={(e) =>
                change("quantity", Number(e.target.value), item.unique)
              }
              placeholder="Количество..."
            />
          </div>
          <div className="df df-col">
            <button
              onClick={() => remove(item.unique)}
              className="btn--eg btn-danger--eg"
            >
              Удалить
            </button>
            {item.change && " *"}
          </div>
        </div>
      ))}
    </>
  );
};

export default UpdateItems;
