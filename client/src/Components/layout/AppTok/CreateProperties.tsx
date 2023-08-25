// ^ Модальное окно с формой добавления Характеристик Товара
import { Fragment, useState } from "react";
import { Row, Col, Button, Form } from "react-bootstrap";

const CreateProperties = (props: any) => {
  const { index, propertiesArr, setPropertiesArr } = props;

  // шаблон Характеристик Товаров
  let templateProp = { name: "", value: "" };
  // ^ для render|state|загрузки на ОБЪЕКТЕ
  // показ.доп.ФормДаты для +n-ых Хар-ик Товара
  const [showBulkFormData, setShowBulkFormData] = useState(0);

  // ^ ДОБАВЛЕНИЕ
  // ^ для render|state|загрузки на ОБЪЕКТЕ
  // const append = (event: any) => {
  //   // перем. state, id Хар-ки, шаблона
  //   let dataProps = { ...properties };
  //   let idProps = event.target.parentElement.id;
  //   let template = { name: "", value: "" };
  //   // перебор state по index
  //   for (const key in dataProps) {
  //     // е/и key и id равны - добавл.шаблон по key
  //     if (key === idProps) dataProps[key].push(template);
  //     // е/и ключ не равен id и id нет в state - добавл.шаблон с нов.id
  //     if (key !== idProps && !(idProps in dataProps))
  //       dataProps = { ...dataProps, [idProps]: [template] };
  //   }
  //   // запись в state
  //   setProperties(dataProps);
  // };

  // ^ для render|state|загрузки на МАССИВЕ
  const appendArr = (event: any) => {
    event.preventDefault();

    // перем. state, id блока Родителя
    let dataPropsArr = [...propertiesArr];
    let idParentPropsNum = Number(event.target.parentElement.id);

    // в масс.Хар-ик по id Родителя в конец добавл. шаблон
    dataPropsArr[idParentPropsNum].push(templateProp);

    // запись в state
    setPropertiesArr(dataPropsArr);

    // ~ пробы
    // ^ arr.push(...items) – добавляет элементы в конец,
    // ^ измен.масс.в сост. - setItems([...items, {id: 1, description: 'New Item'}])
    // ^ arr.splice(start[, deleteCount, elem1, ..., elemN])
    // ^ arr.splice(1, 1); // начиная с индекса 1, удалить 1 элемент
    // ^ удалить 3 первых эл и встав другие - arr.splice(0, 3, "Давай", "танцевать");
    // ^ с инд 2, удал 0 эл, вставить "12", "21" - arr.splice(2, 0, "12", "21");
    // ^ forEach перебор state по item
    // dataPropsArr.forEach((item, index, array) => {
    //   // е/и index и id равны - добавл.шаблон по key
    //   if (index === idParentPropsNum) {
    //     dataPropsArr[index].push(templateProp);
    //   }
    // });
    // ^ for перебор state по index
    // for (const index in dataPropsArr) {
    //   // е/и index и id равны - добавл.шаблон по index
    //   if (Number(index) === idParentPropsNum) dataPropsArr[index].push(templateProp);
    //   // е/и ключ не равен id и id нет в state - добавл.шаблон с нов.id
    //   if (Number(index) !== idParentPropsNum && !(idParentPropsNum in dataPropsArr))
    //     dataPropsArr = { ...dataPropsArr, [idParentPropsNum]: [templateProp] };
    // }
  };

  // ^ Изменение
  const change = (event: any) => {
    // перем. state, и Хар-ик id, id Родителя, name и value
    let dataProps = [...propertiesArr];
    let idProps = Number(
      event.target.parentElement.parentElement.parentElement.id
    );
    let idParentProps = Number(
      event.target.parentElement.parentElement.parentElement.parentElement.id
    );
    let nameForm = event.target.name;
    let valueForm = event.target.value;

    // выбор.в общ.масс.Хар-ик масс.одной Хар-ки по id блока Родителя
    let idDataArr = dataProps[idParentProps];
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
    let dataProps = [...propertiesArr];
    let idProps = Number(
      event.target.parentElement.parentElement.parentElement.id
    );
    let idParentProps = Number(
      event.target.parentElement.parentElement.parentElement.parentElement.id
    );
    let arrParentProps = dataProps[idParentProps];

    // перебор масс.ключей одной Хар-ки
    for (let key of Object.keys(arrParentProps)) {
      // е/и key и id Хар-ки равны - удал.с позиц.id один объ.Хар-ки
      if (Number(key) === idProps) arrParentProps.splice(idProps, 1);
    }

    // запись в state
    setPropertiesArr(dataProps);
  };

  // перем.с полями Параметров Формы (Назв.,Категории,Бренда,Цены,Изо,Хар-ик)
  // const FormsParamProps = (
  // ^ измен.на Комп для передачи props
  // const FormsParamProps = (props: any) => {
  //   const { prop, index, id } = props;

  //   return (
  //     <>
  //       <Row id={props.id} className="mb-2">
  //         <Col>
  //           <Form.Control
  //             name={"name"}
  //             value={props.name}
  //             onChange={(e) => change(e)}
  //             placeholder={"Название... "}
  //             size="sm"
  //           />
  //         </Col>
  //         <Col>
  //           <Form.Control
  //             name={"value"}
  //             value={props.value}
  //             onChange={(e) => change(e)}
  //             placeholder={"Значение... "}
  //             size="sm"
  //           />
  //         </Col>
  //         <Col>
  //           <Button
  //             onClick={(e) => {
  //               remove(e);
  //               setShowBulkFormData(showBulkFormData - 1);
  //               // setArrHar(arrHar.filter((a: any) => a.id !== arrHar.id));
  //             }}
  //             size="sm"
  //             variant="outline-danger"
  //             className="btn-primary--eg danger"
  //             style={{ width: "100%" }}
  //           >
  //             Удалить
  //           </Button>
  //         </Col>
  //       </Row>
  //     </>
  //   );
  //   // );
  // };

  return (
    <>
      {/* <h5>Характеристики</h5> */}
      <Button
        onClick={(e) => {
          appendArr(e);
        }}
        variant="outline-primary"
        size="sm"
        className="btn-primary--eg mb-2"
        style={{
          display: "flex",
          width: "100%",
          justifyContent: "center",
        }}
      >
        Добавить Характеристики Товара
      </Button>
      {/* // ^ для render|state|загрузки на ОБЪЕКТЕ (ч/з доп.state кол-ва эл. showBulkFormData) */}
      {/* масс.Хар-ик для каждого блока ФормДаты по showBulkFormData // ! удаляет ТОЛЬКО последний элемент, в render|state|записи всё верно, НО при удалении render может отрисовывать не тот */}
      {/* {Array(showBulkFormData)
        .fill(0)
        .map((_, index) =>
          showBulkFormData > 0 ? (
            <div
              // id для опред.места записи в масс.Хар-ик от ФормДаты
              id={`` + index}
              key={index}
            >
              <FormsParamProps />
            </div>
          ) : (
            ""
          )
        )} */}
      {/* // ^ для render|state|загрузки на МАССИВЕ */}
      {propertiesArr[index].map((prop: any, index: any) => (
        // Комп // ! state чётко, но форма обн.на кажд.нажатие (вносится по 1ой букв/цифр)
        // <FormsParamProps key={index} id={index} prop={prop} />
        //
        <div key={index} id={index}>
          <Row className="mb-2">
            <Col>
              <Form.Control
                name={"name"}
                value={prop.name}
                onChange={(e) => change(e)}
                placeholder={"Название... "}
                size="sm"
              />
            </Col>
            <Col>
              <Form.Control
                name={"value"}
                value={prop.value}
                onChange={(e) => change(e)}
                placeholder={"Значение... "}
                size="sm"
              />
            </Col>
            <Col>
              <Button
                onClick={(e) => {
                  remove(e);
                }}
                size="sm"
                variant="outline-danger"
                className="btn-danger--eg"
                style={{ width: "100%" }}
              >
                Удалить Хар-ку
              </Button>
            </Col>
          </Row>
        </div>
      ))}
    </>
  );
};

export default CreateProperties;
