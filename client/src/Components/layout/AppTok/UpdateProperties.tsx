// ^ доп.модальн.окно редактирование Характеристик Товара
import { Form } from "react-bootstrap";
import uuid from "react-uuid";

const UpdateProperties = (props: any) => {
  // получ.от родителя масс. хар-тик и fn измен.масс.
  const { properties, setProperties } = props;

  const append = () => {
    setProperties([
      ...properties,
      { id: null, name: "", value: "", unique: uuid(), append: true },
    ]);
  };
  // новую хар-ку надо просто удалить из массива properties, а старую — оставить, но изменить remove на true, чтобы потом выполнить http-запрос на сервер для удаления
  const remove = (unique: any) => {
    const item = properties.find((elem: any) => elem.unique === unique);
    if (item.id) {
      // старая хар-ка
      setProperties(
        properties.map((elem: any) =>
          elem.unique === unique
            ? { ...elem, change: false, remove: true }
            : elem
        )
      );
    } else {
      // новая хар-ка
      setProperties(properties.filter((elem: any) => elem.unique === unique));
    }
  };
  const change = (key: any, value: any, unique: any) => {
    setProperties(
      properties.map((item: any) =>
        item.unique === unique
          ? { ...item, [key]: value, change: !item.append }
          : item
      )
    );
  };

  return (
    <>
      <h5>Характеристики</h5>
      <button onClick={append} className="btn--eg btn-primary--eg mb-3">
        Добавить
      </button>
      {properties.map((item: any) => (
        <div
          key={item.unique}
          className="df df-row mb-2"
          style={{ display: item.remove ? "none" : "flex" }}
        >
          <div className="df df-col">
            <Form.Control
              name={"name_" + item.unique}
              value={item.name}
              onChange={(e) => change("name", e.target.value, item.unique)}
              placeholder="Название..."
              size="sm"
            />
          </div>
          <div className="df df-col">
            <Form.Control
              name={"value_" + item.unique}
              value={item.value}
              onChange={(e) => change("value", e.target.value, item.unique)}
              placeholder="Значение..."
              size="sm"
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

export default UpdateProperties;
