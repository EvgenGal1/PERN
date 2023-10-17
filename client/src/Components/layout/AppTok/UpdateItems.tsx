// ^ доп.модальн.окно редактирование Позиций Заказа
import uuid from "react-uuid";
// import FormField__eg from "../../ui/Form/FormField__eg";
import FormFieldRecursive__EG from "../../ui/Form/FormFieldRecursive__EG";

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

  const change = (event: any, unique: any) => {
    // * ранее на объ.
    // setItems(
    //   items.map((item: any) =>
    //     item.unique === unique
    //       ? { ...item, [key]: value, change: !item.append }
    //       : item
    //   )
    // );

    // на масс.с масс.
    setItems(
      items.map((item: any) => {
        if (item[4][1] === unique) {
          return item.map((subItem: any) => {
            if (subItem[0] === event.target.name) {
              return [subItem[0], event.target.value];
            } else if (subItem[0] === "append") {
              return [subItem[0], !subItem[1]];
            } else {
              return subItem;
            }
          });
        } else {
          return item;
        }
      })
    );
  };

  return (
    <>
      <fieldset className="000 fieldset--eg df df-col mt-3 p-3 pt-">
        <legend className="legend--eg">Позиции Recurs</legend>
        {items.map((item: any, index: any) => {
          const newArray = item.filter(
            (element: any) =>
              element[0] === "name" ||
              element[0] === "price" ||
              element[0] === "quantity"
          );

          return (
            <>
              {/* eslint-disable-next-line react/jsx-pascal-case */}
              <FormFieldRecursive__EG
                key={item[0][1]}
                handleSubmit={change}
                MsgBtn={"Удалить"}
                handleChange={(event: any) => change(event, item[4][1])}
                valueArr={[
                  [newArray[0][0], newArray[0][1]],
                  ["price", newArray[1][1]],
                  ["quantity", newArray[2][1]],
                ]}
                label={true}
                axis={"row"}
              />
              {index !== items.length - 1 && <hr className="mt-2" />}
            </>
          );
        })}
      </fieldset>
    </>
  );
};

export default UpdateItems;
