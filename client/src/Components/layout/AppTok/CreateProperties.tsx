// ^ Модальное окно с формой добавления Характеристик Товара
import { Fragment, useState } from "react";
import { Row, Col, Button, Form } from "react-bootstrap";

const CreateProperties = (props: any) => {
  const { properties, setProperties, propertiesArr, setPropertiesArr } = props;

  // показ.доп.ФормДаты для +n-ых Хар-ик Товара
  const [showBulkFormData, setShowBulkFormData] = useState(0);

  // ^ ДОБАВЛЕНИЕ
  // ^ для render|state|загрузка на ОБЪЕКТЕ
  const append = (event: any) => {
    // перем. state, id Хар-ки, шаблона
    let dataProps = { ...properties };
    let idProps = event.target.parentElement.id;
    let template = { name: "", value: "" };

    // перебор state по key
    for (const key in dataProps) {
      // е/и key и id равны - добавл.шаблон по key
      if (key === idProps) dataProps[key].push(template);

      // е/и ключ не равен id и id нет в state - добавл.шаблон с нов.id
      if (key !== idProps && !(idProps in dataProps))
        dataProps = { ...dataProps, [idProps]: [template] };
    }

    // запись в state
    setProperties(dataProps);
  };
  // ^ для render|state|загрузка на МАССИВЕ
  const appendArr = (event: any) => {
    // setProperties([...properties, { id: nextId++, value: "" }]);
    console.log("apArr 111 ", 111);
    console.log("apArr event ", event);
    console.log(event);
    // перем. state, id Хар-ки, шаблона
    let dataPropsArr = [...propertiesArr];
    // let dataPropsArr = [...properties];
    console.log("apArr dataPropsArr ", dataPropsArr);
    console.log("apArr dataPropsArr.length === ", dataPropsArr.length);
    let idParentProps = event.target.parentElement.id;
    let idNextElProps = event.target.nextSibling?.id;
    console.log(
      "apArr idParentProps | idNextElProps ",
      idParentProps,
      "|",
      idNextElProps
    );
    let template = { name: "", value: "" };
    // let arrProd = dataPropsArr.splice(idProps, 0, "template");
    // console.log("arrProd ", arrProd);
    // console.log(arrProd);
    //
    // if (dataPropsArr?.length === 0) {
    //   console.log("ap dataPropsArr.length >0 ", dataPropsArr.length);
    //   dataPropsArr.splice(2, 0, template);
    //   console.log("IF dataPropsArr ", dataPropsArr);
    // }

    // setPropertiesArr([...properties, template]);
    // console.log("dataPropsArr[idParentProps] ", dataPropsArr[idParentProps]);
    // let arrProd_2 = [...dataPropsArr[idParentProps_2], template];
    // console.log("arrProd_2 ", arrProd_2);

    // ~ пробы
    // ^ arr.push(...items) – добавляет элементы в конец,
    // ^ измен.масс.в сост. - setItems([...items, {id: 1, description: 'New Item'}])
    // ^ arr.splice(start[, deleteCount, elem1, ..., elemN])
    // ^ arr.splice(1, 1); // начиная с индекса 1, удалить 1 элемент
    // ^ удалить 3 первых эл и встав другие - arr.splice(0, 3, "Давай", "танцевать");
    // ^ с инд 2, удал 0 эл, вставить "12", "21" - arr.splice(2, 0, "12", "21");

    if (dataPropsArr?.length === 0) {
      console.log("apArr 000", dataPropsArr?.length, "data length =0= ");
      // dataPropsArr[index].push(template);
      dataPropsArr = [...dataPropsArr, [template]];

      // запись в state
      setPropertiesArr(dataPropsArr);
      return;
    }
    // перебор state по key
    // for (const key in dataPropsArr) {
    dataPropsArr.forEach((item, index, array) => {
      console.log("apArr -_- ", 123, "index =0= ", index);
      console.log("apArr index, item ", index, "-", item);
      //
      //   // е/и key и id равны - добавл.шаблон по key
      if (index === Number(idParentProps)) {
        console.log("apArr item === ", item);
        console.log("apArr dataPropsArr[index] ", dataPropsArr[index]);
        dataPropsArr[index].push(template);
      }

      // idParentProps
      // idNextElProps
      //   // е/и ключ не равен id и id нет в state - добавл.шаблон с нов.id
      // if (key !== idProps && !(idProps in dataPropsArr)) {
      if (
        index !== Number(idParentProps) &&
        !(Number(idParentProps) in dataPropsArr)
      ) {
        console.log("apArr item !=! ", item);
        // dataPropsArr = { ...dataPropsArr, [idParentProps]: [template] };
        // добавить в масс. нов.
        // dataPropsArr[idParentProps] = [
        //   ...dataPropsArr[idParentProps],
        //   [idParentProps],
        //   [template],
        // ]; // ! из not iterable dataPropsArr[idParentProps]
        //
        dataPropsArr.splice(idParentProps, 0, [template]);
      }
    });

    console.log("apArr dataPropsArr ", dataPropsArr);
    // console.log("ap dataPropsArr.length === ", dataPropsArr.length);
    // запись в state
    setPropertiesArr(dataPropsArr);
  };

  // ^ Изменение
  const change = (event: any) => {
    // перем. state, и Хар-ик id, id Родителя, name и value
    let dataProps = { ...properties };
    let idProps = event.target.parentElement.parentElement.parentElement.id;
    let idParentProps =
      event.target.parentElement.parentElement.parentElement.parentElement.id;
    let nameForm = event.target.name;
    let valueForm = event.target.value;

    // в state под id Родителя запись - name:value
    dataProps[idParentProps][idProps] = {
      ...dataProps[idParentProps][idProps],
      [nameForm]: valueForm,
    };
  };

  // ^ Удаление
  const remove = (event: any) => {
    // перем. state и id Хар-ки id, id Родителя, масс.объ.одного Родителя
    let dataProps = { ...properties };
    let idProps = event.target.parentElement.parentElement.parentElement.id;
    let idParentProps =
      event.target.parentElement.parentElement.parentElement.parentElement.id;
    let arrParentProps = dataProps[idParentProps];

    // перебор масс.ключей Родителя
    for (let key of Object.keys(arrParentProps)) {
      // е/и key и id равны - добавл.шаблон по key
      if (key === idProps) arrParentProps.splice(idProps, 1);
    }

    // запись в state
    setProperties(dataProps);
  };

  // перем.с полями Параметров Формы (Назв.,Категории,Бренда,Цены,Изо,Хар-ик)
  // const FormsParamProps = (
  // ^ измен.на Комп для передачи props
  const FormsParamProps = (propsArr: any) => {
    console.log("Комп.FPP propsArr ", propsArr);
    const { prop, index, id } = props;
    console.log("prop, index,id ", prop, index, id);
    console.log("props.index ", propsArr.index);
    return (
      <>
        <Row id={propsArr.id} className="mb-2">
          <Col>
            <Form.Control
              name={"name"}
              // value={item.name}
              onChange={(e) => change(e)}
              placeholder={"Название... "}
              size="sm"
            />
          </Col>
          <Col>
            <Form.Control
              name={"value"}
              // value={item.value}
              onChange={(e) => change(e)}
              placeholder={"Значение... "}
              size="sm"
            />
          </Col>
          <Col>
            <Button
              onClick={(e) => {
                remove(e);
                setShowBulkFormData(showBulkFormData - 1);
                // setArrHar(arrHar.filter((a: any) => a.id !== arrHar.id));
              }}
              size="sm"
              variant="outline-danger"
              className="btn-primary--eg danger"
              style={{ width: "100%" }}
            >
              Удалить
            </Button>
          </Col>
        </Row>
      </>
    );
    // );
  };

  return (
    <>
      {/* <h5>Характеристики</h5> */}
      <Button
        onClick={(e) => {
          append(e);
          appendArr(e);
          setShowBulkFormData(showBulkFormData + 1);
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
      {/* // ! отрисовывает ТОЛЬКО старт НО ничего нового не добавляет */}
      {/* {Array(showBulkFormData).map((_, index) => */}
      {/*  */}
      {/* // ! отрис, добав. НО при нов.добавл./удал./измен. ВСЕ вбитые данн.хар-ик стирает */}
      {/* {Array.from(Array(showBulkFormData), () => {
        return (
          <div id={`` + nextId++} key={nextId++}>
            {FormsParamProps}
          </div>
        );
      })} */}
      {/*  */}
      {/* // * ПОКА самая лучшая версия  */}
      {/* // ^ для render|state|загрузка на ОБЪЕКТЕ (ч/з доп.state кол-ва эл. showBulkFormData) */}
      {/* масс.Хар-ик для каждого блока ФормДаты по showBulkFormData // ! удаляет ТОЛЬКО последний элемент, в render|state|записи всё верно, НО при удалении render может отрисовывать не тот */}
      {Array(showBulkFormData)
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
        )}
      {/*  */}
      {/*  */}
      {/* // ^ пробовать прописать render хар-ик через properties, поскольку надо обновлять отрисов./изменять/удалять по имеющемся данным. Отрисовка ч/з Array|fill|map|from хороша для старта, но либо не хранит данн.при изменении, либо удаляет не корр. */}
      {/* // ~ С properties есть сложность, т.к. это объ.с масс., а отрисовка по map для массивов. Как вариант переписать ВСЮ логику на front|back под масс. для хар-ик (на back приходит строка, можно заКОСТЫЛить замену первого и последней квадр.скобки на фигурные чтоб логика объ не ломалась  )  */}
      {/* {keyPropLength.map((arrH: any) => ( */}
      {/* {arrHar.map((arrH: any) => ( */}
      {/* {Object.values(properties).map((arrH: any, index) => ( */}
      {/* {result.map((arrH: any, index) => ( */}
      {/* // <p key={index}>{prop.length}</p> */}
      {/* // {prop.length(<p></p>)} */}
      {/* // ^ для render|state|загрузка на МАССИВЕ */}
      {/* {propertiesArr.map((prop: any, index: any) => (
        <Fragment key={index}>
          <p id={index}>
            -{prop.name}={index}:{prop.length}
          </p>
          {prop.map((prop: any, index: any) => {
            <span key={index}>
              _{prop.name}+{index}
            </span>;
          })}
        </Fragment>
      ))} */}
      {/* // ^ отрисовка из ОБЪЕКТА */}
      {/* {Object.keys(properties).map((key, i) => {
        return (
          <p key={key}>
            {key} - {i} = <span>{properties[key].value}</span>
          </p>
        );
      })} */}
      {/*  */}
      {/*  */}
      {/*  */}
      {/*  */}
      {/* const [name, setName] = useState('');
  const [artists, setArtists] = useState([]); */}
      {/* return ( */}
      {/* <button onClick={() => {
        setArtists([
          ...artists,
          { id: nextId++, name: name }
        ]);
      }}>Add</button>
      <ul>
        {artists.map(artist => (
          <li key={artist.id}>{artist.name}</li>
        ))}
      </ul> */}
    </>
  );
};

export default CreateProperties;
