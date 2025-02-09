// ^ Модальное окно с формой добавления Характеристик Продукта
import { Form } from "react-bootstrap";

const CreateProperties = (props: any) => {
  const { index, propertiesArr, setPropertiesArr } = props;

  // шаблон Характеристик Продуктов
  const templateProp = { name: "", value: "" };

  // ^ для render|state|загрузки на МАССИВЕ
  const appendArr = (event: any) => {
    event.preventDefault();

    // перем. state, id блока Родителя
    const dataPropsArr = [...propertiesArr];
    const idParentPropsNum = Number(event.target.parentElement.id);

    // в масс.Хар-ик по id Родителя в конец добавл. шаблон
    dataPropsArr[idParentPropsNum].push(templateProp);

    // запись в state
    setPropertiesArr(dataPropsArr);
  };

  // ^ Изменение
  const change = (event: any) => {
    // перем. state, и Хар-ик id, id Родителя, name и value
    const dataProps = [...propertiesArr];
    const idProps = Number(
      event.target.parentElement.parentElement.parentElement.id
    );
    const idParentProps = Number(
      event.target.parentElement.parentElement.parentElement.parentElement.id
    );
    const nameForm = event.target.name;
    const valueForm = event.target.value;

    // выбор.в общ.масс.Хар-ик масс.одной Хар-ки по id блока Родителя
    const idDataArr = dataProps[idParentProps];
    // ^ в state Хар-ик > в масс.по id блока Родителя > в масс.Харки по id блока Хар-ки, наход.объ. > в объ.наход.ключ = nameForm и его значен.присваиваем valueForm
    dataProps[idParentProps][idProps][nameForm] = valueForm;

    // ^ обнов.сразу state (копир до и после indx и вставляя нов.объ. между)
    setPropertiesArr((existingItems: any) => {
      return [
        ...existingItems.slice(0, idParentProps),
        idDataArr,
        ...existingItems.slice(idParentProps + 1),
      ];
    });
  };

  // ^ Удаление
  const remove = (event: any) => {
    // перем. state и id Хар-ки id, id Родителя, масс.Хар-ик одного Родителя
    const dataProps = [...propertiesArr];
    const idProps = Number(
      event.target.parentElement.parentElement.parentElement.id
    );
    const idParentProps = Number(
      event.target.parentElement.parentElement.parentElement.parentElement.id
    );
    const arrParentProps = dataProps[idParentProps];

    // перебор масс.ключей одной Хар-ки
    for (const key of Object.keys(arrParentProps)) {
      // е/и key и id Хар-ки равны - удал.с позиц.id один объ.Хар-ки
      if (Number(key) === idProps) arrParentProps.splice(idProps, 1);
    }

    // запись в state
    setPropertiesArr(dataProps);
  };

  return (
    <>
      {/* <h5>Характеристики</h5> */}
      <button
        onClick={(e) => {
          appendArr(e);
        }}
        className="btn--eg btn-primary--eg mb-3 df df-jcc w-100"
      >
        Добавить Характеристики Продукта
      </button>
      {/* // ^ для render|state|загрузки на МАССИВЕ */}
      {propertiesArr[index].map((prop: any, index: any) => (
        // Комп // ! state чётко, но форма обн.на кажд.нажатие (вносится по 1ой букв/цифр)
        // <FormsParamProps key={index} id={index} prop={prop} />
        //
        <div key={index} id={index}>
          <div className="df df-row mb-2">
            <div className="df df-col">
              <Form.Control
                name={"name"}
                value={prop.name}
                onChange={(e) => change(e)}
                placeholder={"Название... "}
                size="sm"
              />
            </div>
            <div className="df df-col">
              <Form.Control
                name={"value"}
                value={prop.value}
                onChange={(e) => change(e)}
                placeholder={"Значение... "}
                size="sm"
              />
            </div>
            <div className="df df-col">
              <button
                onClick={(e) => {
                  remove(e);
                }}
                className="btn--eg btn-danger--eg w-100"
              >
                Удалить Хар-ку
              </button>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default CreateProperties;
