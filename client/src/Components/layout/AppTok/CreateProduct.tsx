// ^ Модальное окно с формой добавления Товара
import { useState, useEffect, Fragment } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";

import {
  createProduct,
  fetchCategories,
  fetchBrands,
} from "../../../http/Tok/catalogAPI_Tok";
import CreateProperties from "./CreateProperties";

// перем.Валидации/Значений по умолч.
const defaultValue: any = {
  name: "",
  price: "",
  category: "",
  brand: "",
  image: [],
};
const defaultValid = {
  name: null,
  price: null,
  category: null,
  brand: null,
  image: null,
};

// перем. Значений для доп.ФормДат по умолч.
// ^ для render|state|загрузки на ОБЪЕКТЕ
let defaultValueBulk: { [key: string | number]: any } = {
  name: [],
  price: [],
  category: [],
  brand: [],
  image: [],
};

// перем. Характеристик для доп.ФормДат по умолч.
// ^ для render|state|загрузки на ОБЪЕКТЕ
let defaultValueBulkProps: { [key: string | number]: any } = {
  0: [],
};

const isValid = (value: any) => {
  // const result: any = {};
  const pattern = /^[1-9][0-9]*$/;
  // for (let key in value) {
  //   if (key === "name") result.name = value.name.trim() !== "";
  //   if (key === "price") result.price = pattern.test(value.price.trim());
  //   if (key === "category") result.category = pattern.test(value.category);
  //   if (key === "brand") result.brand = pattern.test(value.brand);
  // }
  // return result;

  // const result: any = [];
  // const result: any = {};
  // ^ пока без проверки (разруш.объ.на не именнов.масс.)
  const result: any = value;
  // for (const prop in value) {
  //   console.log("prop ", prop);
  //   console.log(prop);
  //   const val = value[prop];
  //   console.log("val ", val);
  //   console.log(val);
  //   if (typeof val === "object") {
  //     console.log("Array(val) ", Array(val));
  //     result.push(Array(val)); // <- recursive call
  //     // if (val === "name") result.push(Array(val))/* name */ = value.name.trim() !== "";
  //     // if (val === "price") result.push(Array(val))/* price */ = pattern.test(value.price.trim());
  //     // if (val === "category") result.push(Array(val))/* category */ = pattern.test(value.category);
  //     // if (val === "brand") result.push(Array(val))/* brand */ = pattern.test(value.brand);
  //   } else {
  //     result.push(val);
  //   }
  // }
  console.log("result ", result);
  console.log(result);
  return result;
};

const CreateProduct = (props: any) => {
  const { show, setShow, setChange } = props;

  // валидация // ! врем.откл.
  const [valid, setValid] = useState(defaultValid);
  // доп.ФормДаты для неск.Товаров
  // ^ для render|state|загрузки на ОБЪЕКТЕ
  const [valueBulk, setValueBulk] = useState(defaultValueBulk);
  // console.log("valueBulk ", valueBulk);
  // {brand:['1', '2'], category:['2', '3'], image:[], name:['11', '22'], price:['11', '22']}
  // показ.доп.ФормДаты для +n-ых Товаров // ! упраздён т.к. render не ч/з Array(showBulkFormData).fill(0).map а ч/з state
  // const [showBulkFormData, setShowBulkFormData] = useState(0);
  // ^ для render|state|загрузки на МАССИВЕ
  // шаблон и state
  let templateAtt = { brand: "", category: "", image: "", name: "", price: "" };
  const [valueBulkArr, setValueBulkArr]: any = useState([templateAtt]);
  // console.log("valueBulkArr ", valueBulkArr);

  // список характеристик товара
  // ^ для render|state|загрузки на ОБЪЕКТЕ
  const [properties, setProperties] = useState(defaultValueBulkProps);
  // console.log("CrePRD properties ", properties);
  // {0: Array(1), 1: Array(2)} >>> {0: [0: {name: '12', value: '12'}], 1: [0: {name: '23', value: '23'} 1: {name: '2323', value: '2323'}]} - объ.с массивами объектов
  // ^ для render|state|загрузки на МАССИВЕ
  // const [propertiesArr, setPropertiesArr] = useState([
  //   [{ name: "12", value: "12" }],
  //   [
  //     { name: "23", value: "23" },
  //     { name: "2323", value: "2323" },
  //   ],
  // ]);
  const [propertiesArr, setPropertiesArr]: any = useState([]);
  // console.log("CrePRD propertiesArr ", propertiesArr);
  // [0: Array(1), 1: Array(2)] >>> [0: [0: {name: '12', value: '12'}], 1: [0: {name: '23', value: '23'} 1: {name: '2323', value: '2323'}]] - массив с массивами объектов

  // список Категорий/Брендов для возможности выбора
  const [categories, setCategories]: any = useState(null);
  const [brands, setBrands]: any = useState(null);

  // fn() сброса на нач.знач. statов и ФормДат ?нужна ли?
  const resetValueAndValidAndVBulk = () => {
    console.log("reset ", 0);
    // приводим форму в изначальное состояние
    // setValue(defaultValue);
    setValid(defaultValid);

    // сброс доп.ФормДат
    // ^ для render|state|загрузки на ОБЪЕКТЕ
    // setShowBulkFormData(0);
    // setValueBulk(defaultValueBulk);
    // ! не раб.востан.перем.по умолч. Происходит запись в перем.даже при const
    defaultValueBulk = {
      name: [],
      // name: {},
      price: [],
      // price: {},
      category: [],
      // category: {},
      brand: [],
      // brand: {},
      image: [],
      // image: {},
    };
    setValueBulk(defaultValueBulk);
    // ^ для render|state|загрузки на МАССИВЕ
    setValueBulkArr([templateAtt]);

    // сброс Хар-ик
    // setProperties([]);
    // ! не раб.востан.перем.по умолч. Происходит запись в перем.даже при const
    // ^ для render|state|загрузки на ОБЪЕКТЕ
    defaultValueBulkProps = { 0: [] };
    setProperties(defaultValueBulkProps);
    // ^ для render|state|загрузки на МАССИВЕ
    setPropertiesArr([]);
  };

  // изначально получить с сервера списки Категорий/Брендов
  useEffect(() => {
    fetchCategories().then((data) => setCategories(data));
    fetchBrands().then((data) => setBrands(data));
  }, []);

  // сохр.данн в state для масс.запроса от доп.ФормДат
  // ^ для render|state|загрузки на ОБЪЕКТЕ
  const bulkHandleInputChange = (event: any) => {
    // console.log("hndlInp 000 event.target.name|value ", event.target?.name, event.target?.value);

    // запись доп.ФормДаты из state в перем.
    let data = {
      ...valueBulk,
    };

    console.log("hndlInp data 000 ", data);
    if (event.target.name) {
      // перебор парам.в data по key
      for (const key in data) {
        // выборка name,category,brand,price для записи
        if (key === event.target.name && event.target.name !== "image") {
          let num: number = 0;

          // ^ находим id formы родителя для опред.в какое место параметра массива записывать значение
          // имя
          if (event.target?.name === "name")
            num = Number(event.target.parentElement.id);
          // categor | brand | price | img
          if (
            event.target?.name === "category" ||
            event.target?.name === "brand" ||
            event.target?.name === "price"
          )
            num = Number(
              event.target.parentElement.parentElement.parentElement.id
            );

          // data[key].push(event.target.value);
          data[key][num] = event.target.value;
        }
        // выборка Изо для записи
        if (key === event.target.name && event.target.name === "image") {
          let num = Number(
            event.target.parentElement.parentElement.parentElement.id
          );
          // data[key] = { ...[key], ...event.target.files };
          // data[key].push(/* event.target.files[0].name, */ event.target.files[0]);
          data[key][num] = event.target.files[0];
        }
      }
      // console.log("hndlInp DATA 111 ", data);
      setValueBulk(data);
    }
    console.log("hndlInp valueBulk ", valueBulk);
  };

  // ^ для render|state|загрузки на МАССИВЕ
  // ^ ДОБАВЛЕНИЕ // ? нужно ли ? может сразу в btn изменять ?
  const handlerAddBulkValue = () => {
    console.log("ADD++ 123 ", 123);
    // let dataArr = [...valueBulkArr];
    // let tempateArr = {
    //   brand: "",
    //   category: "",
    //   image: "",
    //   name: "",
    //   price: "",
    //   // idArr: valueBulkArr?.length,
    // };
    setValueBulkArr([...valueBulkArr, templateAtt]);
  };

  // ^ УДАЛЕНИЕ
  const handlerDeleteBulkValue = (event: any) => {
    event.preventDefault();
    console.log("ARR DEL event ", event);

    // перем. id блока нумерованная
    let idParentPropsNum = Number(event.target.parentElement.id);

    // ^ Удал.эл.м/у эл-ми масс.(копир данные до и после indexa(idParentPropsNum))
    setValueBulkArr((existingItems: any) => {
      // для 0 indexa
      if (idParentPropsNum === 0) {
        return existingItems.slice(1);
      }
      // для всех остальных index
      else {
        return [
          ...existingItems.slice(0, idParentPropsNum),
          ...existingItems.slice(idParentPropsNum + 1),
        ];
      }
      // аналогично
      // return existingItems.reduce(
      //   (prev: string | any[], x: any, i: number) =>
      //     prev.concat(i === idParentPropsNum ? [] : x),
      //   []
      // );
    });
  };

  // ^ ИЗМЕНЕНИЯ
  const handlerChangeBulkValue = (event: any) => {
    event.preventDefault();
    // запись доп.ФормДаты из state в перем.
    console.log("INPT event ", event);
    let dataArr = [...valueBulkArr];

    // перем. Имени и Значения поля формы
    let nameForm = event.target.name;
    let valueForm = event.target.value;

    // перем./расчёт id блока события на разной вложенности
    let numId: number = 0;
    let idParentProps = event.target.parentElement.id;
    let idParentPropsNest =
      event.target.parentElement.parentElement.parentElement.id;
    if (nameForm === "name") {
      numId = Number(idParentProps);
    } else {
      numId = Number(idParentPropsNest);
    }

    // выбор.в масс. объ.по id блока
    let idDaraArr = dataArr[numId];
    // реребор объ.по key
    for (const key in idDaraArr) {
      // запись е/и key = name, кроме image
      if (key === nameForm && nameForm !== "image") {
        idDaraArr[key] = valueForm;
      }
      // запись е/и key = image
      if (key === nameForm && nameForm === "image") {
        idDaraArr[key] = event.target.files[0];
      }
    }

    // ^ обнов.сразу state (копир до и после indx и вставляя нов.объ. между)
    setValueBulkArr((existingItems: any) => {
      return [
        ...existingItems.slice(0, numId),
        // {
        //   ...existingItems[idParentProps],
        //   nameForm: existingItems[idParentProps].valueForm,
        // },
        //
        idDaraArr,
        ...existingItems.slice(numId + 1),
      ];
      // аналогично
      //   return existingItems.map((item) => {
      //     return item.id === currentId ? { ...item, score: item.score + 1 } : item;
      //   });
    });
  };

  // кнп.Сохранить(отправка/получ.данн.Сервера)
  const handleSubmit = (event: any) => {
    event.preventDefault();

    /*
     * На первый взгляд кажется, что переменная correct не нужна, можно обойтись valid, но это не так. Нельзя использовать значение valid сразу после изменения этого значения — ф-ция setValid не изменяет значение состояния мгновенно. Вызов функции лишь означает — React «принял к сведению» наше сообщение, что состояние нужно изменить.
     */
    // const correct = isValid(value);
    const correct = isValid(valueBulk);
    const correctArr = isValid(valueBulkArr);
    setValid(correct);

    // все поля формы прошли проверку, можно отправлять данные на сервер
    if (
      /* correct.name && correct.price && correct.category && correct.brand */ true
    ) {
      console.log("SBM IF 1 ", 1);

      // ^ для render|state|загрузки на ОБЪЕКТЕ
      let formData = new FormData();
      for (let key in valueBulk) {
        if (key === "name") formData.append("name", valueBulk.name);
        if (key === "price") formData.append("price", valueBulk.price);
        if (key === "category")
          formData.append("categoryId", valueBulk.category);
        if (key === "brand") formData.append("brandId", valueBulk.brand);
        if (key === "image") {
          let imgLenght = valueBulk.image.length;
          for (var i = 0; i < imgLenght; i++) {
            formData.append(
              "image",
              valueBulk.image[i],
              valueBulk.image[i].name
            );
          }
        }
      }

      // ^ для render|state|загрузки на МАССИВЕ
      let formDataArr = new FormData();
      correctArr.map((fd: any) => {
        console.log("SBM ARR fd ", fd);
        // let resultArr = {}
        for (let key in fd) {
          // console.log("fd.name ", fd.name);
          console.log("SBM ARR key ", key);
          if (key === "name") formDataArr.append("name", fd.name);
          if (key === "price") formDataArr.append("price", fd.price);
          if (key === "category") formDataArr.append("categoryId", fd.category);
          if (key === "brand") formDataArr.append("brandId", fd.brand);
          if (key === "image")
            formDataArr.append("image", fd?.image, fd?.image?.name);
        }
      });

      // ~ проверки
      // ^ для render|state|загрузки на ОБЪЕКТЕ
      // // вывод каждого значения
      // const pairs = Array.from(formData.entries());
      // for (let /* pair */ [key, value] of pairs) {
      //   console.log("кажд кл./знач. pair ", `${key}: ${value}` /* pair */);
      // }
      // // вывод каждого масс.в объ.
      // console.log(...pairs);
      // // вывод Таблицы
      // console.table([...pairs]);
      // // вывод объ.со значениями
      // console.log("OBJ pairs " + Object.fromEntries(pairs));
      // console.log(Object.fromEntries(pairs));

      // ^ для render|state|загрузки на МАССИВЕ
      const pairs_2 = Array.from(formDataArr.entries());
      for (let /* pair */ [key, value] of pairs_2) {
        console.log("кажд кл./знач. pair ", `${key}: ${value}` /* pair */);
      }
      // вывод каждого масс.в объ.
      console.log(...pairs_2);
      // вывод Таблицы
      console.table([...pairs_2]);
      // вывод объ.со значениями
      console.log(Object.fromEntries(pairs_2));

      // характеристики нового товара
      // if (properties.length) {
      // ! врем.откл. проверку для отраб.масс.загр.Хар-ик Товара
      // const props = properties.filter(
      //   (prop: any) => prop.name.trim() !== "" && prop.value.trim() !== ""
      // );
      // if (props.length) {
      if (properties) {
        formData.append("props", JSON.stringify(properties));
        // data.push("props", JSON.stringify(props));
      }
      // }
      console.log("SBM formData ", formData);

      // отправка/получение data на/с Сервера
      // createProduct(formData)
      createProduct(formDataArr)
        .then((data) => {
          console.log("SBM CrePPP data ", data);
          // приводим форму в изначальное состояние
          event.target.image.value = "";
          resetValueAndValidAndVBulk();
          // закрываем модальное окно создания товара
          setShow(false);
          // изменяем состояние компонента списка товаров, чтобы в этом списке появился и новый товар
          setChange((state: any) => !state);
        })
        .catch((error) => alert(error.response.data.message));
    }
  };

  // ! врем.хар-ки
  const appendArr = (event: any) => {
    event.preventDefault();
    // setProperties([...properties, { id: nextId++, value: "" }]);
    console.log("apArr 111 ", 111);
    console.log("apArr event ", event);
    console.log(event);
    // перем. state, id Хар-ки, шаблона
    let dataPropsArr /* : any[] */ = [...propertiesArr];
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

  // перем.с полями Параметров Формы (Назв.,Категории,Бренда,Цены,Изо,Хар-ик)
  // const FormsParam = ( // ! не приним propsы
  // ! форма обн.на кажд.нажатие
  // const FormsParamComp = (propsArr: any) => {
  //   // console.log("КОМП propsArr ", propsArr);
  //   // console.log("КОМП propsArr.index ", propsArr.index);
  //   // console.log("КОМП propsArr.prop.name ", propsArr.prop.name);

  //   return (
  //     <div id={propsArr.index}>
  //       {/* Название */}
  //       <Form.Control
  //         name="name"
  //         // блок на все знач.из state для неск.ФормДат
  //         // value={value.name}
  //         // берём знач.из state для кажд.эл.
  //         value={propsArr.prop.name}
  //         onChange={(e) => {
  //           // пока 2 fn() записи знач.(для 1го Товара и Нескольких)
  //           // handleInputChange(e);
  //           bulkHandleInputChange(e);
  //           // setTimeout(() => {
  //           handlerChangeBulkValue(e);
  //           // }, 5000);
  //         }}
  //         isValid={valid.name === true}
  //         isInvalid={valid.name === false}
  //         placeholder="Название товара..."
  //         className="mb-3"
  //       />
  //       {/* Категория/Бренд */}
  //       <Row className="mb-3">
  //         <Col>
  //           <Form.Select
  //             name="category"
  //             // value={value.category}
  //             value={propsArr.prop.category}
  //             onChange={(e) => {
  //               // handleInputChange(e);
  //               bulkHandleInputChange(e);
  //               handlerChangeBulkValue(e);
  //             }}
  //             isValid={valid.category === true}
  //             isInvalid={valid.category === false}
  //           >
  //             {/* // ! не раб.скрытие 1го opt.при откр.select */}
  //             <option value="">Категория</option>
  //             {categories &&
  //               categories.map((item: any) => (
  //                 <option key={item.id} value={item.id}>
  //                   {item.name}
  //                 </option>
  //               ))}
  //           </Form.Select>
  //         </Col>
  //         <Col>
  //           <Form.Select
  //             name="brand"
  //             // value={value.brand}
  //             value={propsArr.prop.brand}
  //             onChange={(e) => {
  //               // handleInputChange(e);
  //               bulkHandleInputChange(e);
  //               handlerChangeBulkValue(e);
  //             }}
  //             isValid={valid.brand === true}
  //             isInvalid={valid.brand === false}
  //           >
  //             <option value="">Бренд</option>
  //             {brands &&
  //               brands.map((item: any) => (
  //                 <option key={item.id} value={item.id}>
  //                   {item.name}
  //                 </option>
  //               ))}
  //           </Form.Select>
  //         </Col>
  //       </Row>
  //       {/* Цена/Изо */}
  //       <Row className="mb-3">
  //         <Col>
  //           <Form.Control
  //             name="price"
  //             // value={value.price}
  //             value={propsArr.prop.price}
  //             onChange={(e) => {
  //               // handleInputChange(e);
  //               bulkHandleInputChange(e);
  //               handlerChangeBulkValue(e);
  //             }}
  //             isValid={valid.price === true}
  //             isInvalid={valid.price === false}
  //             placeholder="Цена товара..."
  //           />
  //         </Col>
  //         <Col>
  //           <Form.Control
  //             name="image"
  //             type="file"
  //             onChange={(e) => {
  //               // handleImageChange(e);
  //               // handleInputChange(e);
  //               bulkHandleInputChange(e);
  //               handlerChangeBulkValue(e);
  //             }}
  //             placeholder="Фото товара..."
  //           />
  //         </Col>
  //       </Row>
  //       {/* // ^ ХАРАКТЕРИСТИКИ */}
  //       <Button
  //         onClick={(e) => {
  //           // append(e);
  //           appendArr(e);
  //           // setShowBulkFormData(showBulkFormData + 1);
  //         }}
  //         variant="outline-primary"
  //         size="sm"
  //         className="btn-primary--eg mb-2"
  //         style={{
  //           display: "flex",
  //           width: "100%",
  //           justifyContent: "center",
  //         }}
  //       >
  //         Добавить Характеристики Товара
  //       </Button>
  //       {propertiesArr.map((props: any, index: any) => {
  //         // console.log("props ", props);
  //         return (
  //           <div key={index}>
  //             {/* <h2>Name: {employee.name}</h2> */}

  //             {props.map((prop: any, index: any) => {
  //               // console.log("prop ", prop);
  //               return <div key={index}>{<h2>prop: {prop.name}</h2>}</div>;
  //             })}

  //             <hr />
  //           </div>
  //         );
  //       })}
  //       {/* <CreateProperties
  //       properties={properties}
  //       setProperties={setProperties}
  //       propertiesArr={propertiesArr}
  //       setPropertiesArr={setPropertiesArr}
  //     /> */}
  //       {/* // ^ кнп. УДАЛЕНИЯ */}
  //       {valueBulkArr.length > 1 && (
  //         <Button
  //           // type="submit"
  //           size="sm"
  //           variant="danger"
  //           className="btn-danger--eg"
  //           style={{ width: "100%" }}
  //           onClick={(e) => {
  //             setShowBulkFormData(showBulkFormData - 1);
  //             handlerDeleteBulkValue(e);
  //           }}
  //         >
  //           Убрать Товар
  //         </Button>
  //       )}
  //       <hr
  //         style={{
  //           margin: "2rem 0",
  //           order: "1px solid",
  //           opacity: "1",
  //           color: "var(--bord-hr)",
  //         }}
  //       />
  //     </div>
  //   );
  // };

  return (
    <Modal
      show={show}
      onHide={() => {
        setShow(false);
        // вызов fn() сброса на нач.знач. statов и ФормДат ?нужна ли?
        resetValueAndValidAndVBulk();
      }}
      // блок на закрытие при клике вне Modal
      backdrop="static"
      size="lg"
      className="modal--eg-bootstr"
    >
      <Modal.Header closeButton style={{ padding: "5px" }}>
        <Modal.Title style={{ position: "relative" }}>Новый товар</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form
          noValidate
          onSubmit={handleSubmit}
          // ! врем.стиль для расшир.отражения
          // style={{ minWidth: "800px" }}
        >
          {/* ФормДата для загр.1го Товара */}
          {/* <div id="0">{FormsParam}</div> */}
          {/* доп.ФормДаты для масс.загр.Товаров */}
          {/* // ^ для render|state|загрузки на ОБЪЕКТЕ (ч/з доп.state кол-ва эл. showBulkFormData) */}
          {/* {Array(showBulkFormData)
            .fill(0)
            .map((_, index) =>
              showBulkFormData > 0 ? (
                <div
                  // id + 1 для опред.места записи в масс.парам. ФормДаты
                  id={`` + (index + 1)}
                  key={index}
                >
                  {FormsParam}
                </div>
              ) : (
                ""
              )
            )} */}
          {/* // ^ для render|state|загрузки на МАССИВЕ */}
          {valueBulkArr.map((prop: any, index: any) => (
            // Комп // ! state чётко, но форма обн.на кажд.нажатие (вносится по 1ой букв/цифр)
            // <Fragment key={index}>
            // <FormsParamComp key={index} prop={prop} index={index} />
            // </Fragment>
            // перем. // ! state чётко, но render при удален убирает только последний эл.(нет считывания value из props)
            // <div id={index} key={index}>
            //   {FormsParam}
            // </div>
            // напрямую // * state чётко, render чётко
            <div id={index} key={index}>
              {/* Название */}
              <Form.Control
                name="name"
                value={prop.name}
                onChange={(e) => {
                  handlerChangeBulkValue(e);
                }}
                isValid={valid.name === true}
                isInvalid={valid.name === false}
                placeholder="Название товара..."
                className="mb-3"
              />
              {/* Категория/Бренд */}
              <Row className="mb-3">
                <Col>
                  <Form.Select
                    name="category"
                    value={prop.category}
                    onChange={(e) => {
                      handlerChangeBulkValue(e);
                    }}
                    isValid={valid.category === true}
                    isInvalid={valid.category === false}
                  >
                    {/* // ! не раб.скрытие 1го opt.при откр.select */}
                    <option value="">Категория</option>
                    {categories &&
                      categories.map((item: any) => (
                        <option key={item.id} value={item.id}>
                          {item.name}
                        </option>
                      ))}
                  </Form.Select>
                </Col>
                <Col>
                  <Form.Select
                    name="brand"
                    value={prop.brand}
                    onChange={(e) => {
                      handlerChangeBulkValue(e);
                    }}
                    isValid={valid.brand === true}
                    isInvalid={valid.brand === false}
                  >
                    <option value="">Бренд</option>
                    {brands &&
                      brands.map((item: any) => (
                        <option key={item.id} value={item.id}>
                          {item.name}
                        </option>
                      ))}
                  </Form.Select>
                </Col>
              </Row>
              {/* Цена/Изо */}
              <Row className="mb-3">
                <Col>
                  <Form.Control
                    name="price"
                    value={prop.price}
                    onChange={(e) => {
                      handlerChangeBulkValue(e);
                    }}
                    isValid={valid.price === true}
                    isInvalid={valid.price === false}
                    placeholder="Цена товара..."
                  />
                </Col>
                <Col>
                  <Form.Control
                    name="image"
                    type="file"
                    onChange={(e) => {
                      handlerChangeBulkValue(e);
                    }}
                    placeholder="Фото товара..."
                  />
                </Col>
              </Row>
              {/* // ^ ХАРАКТЕРИСТИКИ */}
              <Button
                onClick={(e) => {
                  // append(e);
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
              {propertiesArr.map((props: any, index: any) => {
                // console.log("props ", props);
                return (
                  <div key={index}>
                    {/* <h2>Name: {employee.name}</h2> */}

                    {props.map((prop: any, index: any) => {
                      // console.log("prop ", prop);
                      return (
                        <div key={index}>{<h2>prop: {prop.name}</h2>}</div>
                      );
                    })}

                    <hr />
                  </div>
                );
              })}
              {/* <CreateProperties
              properties={properties}
              setProperties={setProperties}
              propertiesArr={propertiesArr}
              setPropertiesArr={setPropertiesArr}
            /> */}
              {/* // ^ кнп. УДАЛЕНИЯ */}
              {valueBulkArr.length > 1 && (
                <Button
                  // type="submit"
                  size="sm"
                  variant="danger"
                  className="btn-danger--eg"
                  style={{ width: "100%" }}
                  onClick={(e) => {
                    handlerDeleteBulkValue(e);
                    // setValueBulkArr((existingItems: any) => {
                    //   return [
                    //     ...existingItems.slice(0, index),
                    //     ...existingItems.slice(index + 1),
                    //   ];
                    // });
                  }}
                >
                  Убрать Товар
                </Button>
              )}
              <hr
                style={{
                  margin: "2rem 0",
                  order: "1px solid",
                  opacity: "1",
                  color: "var(--bord-hr)",
                }}
              />
            </div>
          ))}
          <div className="mt-2" style={{ display: "block" }}>
            {/* кнп.Добавить/Убрать Товар */}
            <Col
              className="mb-3"
              style={{ display: "flex", margin: "0px !important" }}
            >
              <Button
                // type="submit"
                size="sm"
                variant="primary"
                className="btn-primary--eg"
                style={{ width: "100%" }}
                onClick={() => {
                  handlerAddBulkValue();
                  // setValueBulkArr([...valueBulkArr, templateAtt]);
                }}
              >
                Добавить Товар
              </Button>
              {/* // ! перезд в ФормДату для удал.кажд.эл.по отдельности */}
              {/* <Button
                // type="submit"
                size="sm"
                variant="danger"
                className="btn-danger--eg"
                style={{ width: "100%", marginLeft: "10px" }}
                onClick={() => setShowBulkFormData(showBulkFormData - 1)}
              >
                Убрать Товар
              </Button> */}
            </Col>
            <hr
              style={{
                margin: "1rem 0",
                order: "1px solid",
                opacity: "1",
                color: "var(--bord-hr)",
              }}
            />
            {/* кнп.Сохранить */}
            <Col>
              <Button
                type="submit"
                size="sm"
                variant="success"
                className="btn-success--eg"
                style={{ width: "100%" }}
              >
                Сохранить
              </Button>
            </Col>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CreateProduct;
