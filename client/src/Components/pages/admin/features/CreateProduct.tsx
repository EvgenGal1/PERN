// ^ Модальное окно с формой добавления Продукта
import { useEffect, useState } from "react";
import { Form, Modal } from "react-bootstrap";

import { brandAPI } from "@api/catalog/brandAPI";
import { categoryAPI } from "@api/catalog/categoryAPI";
import { productAPI } from "@api/catalog/productAPI";
import CreateProperties from "./CreateProperties";

// перем.Валидации/Значений по умолч.
// const defaultValue: any = {
//   name: "",
//   price: "",
//   category: "",
//   brand: "",
//   image: [],
// };
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
// let defaultValueBulkProps: { [key: string | number]: any } = {
//   0: [],
// };

const templateValueArr: { [key: string | number]: string | number } = {
  brand: "",
  category: "",
  image: "",
  name: "",
  price: "",
};

const isValid = (value: any) => {
  // const result: any = {};
  // const pattern = /^[1-9][0-9]*$/;

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
  // доп.ФормДаты для неск.Продуктов
  // ^ для render|state|загрузки на ОБЪЕКТЕ
  const [valueBulk, setValueBulk] = useState(defaultValueBulk);
  // console.log("valueBulk ", valueBulk);

  // ^ для render|state|загрузки на МАССИВЕ
  // шаблон и state Продуктов
  const [valueBulkArr, setValueBulkArr]: any = useState([templateValueArr]);
  // console.log("valueBulkArr ", valueBulkArr);

  // список характеристик Продукта
  // ^ для render|state|загрузки на ОБЪЕКТЕ
  // const [properties, setProperties] = useState(defaultValueBulkProps);
  // console.log("CrePRD properties ", properties);

  // ^ для render|state|загрузки на МАССИВЕ
  // state Характеристик Продуктов
  const [propertiesArr, setPropertiesArr]: any = useState([[]]);
  // console.log("CrePRD propertiesArr ", propertiesArr);

  // список Категорий/Брендов для возможности выбора
  const [categories, setCategories]: any = useState(null);
  const [brands, setBrands]: any = useState(null);

  // fn() сброса на нач.знач. statов и ФормДат ?нужна ли?
  const resetValueAndValidAndVBulk = () => {
    console.log("reset ", 0);
    // приводим форму в изначальное состояние
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
    setValueBulkArr([templateValueArr]);

    // сброс Хар-ик
    // setProperties([]);
    // ! не раб.востан.перем.по умолч. Происходит запись в перем.даже при const
    // ^ для render|state|загрузки на ОБЪЕКТЕ
    // defaultValueBulkProps = { 0: [] };
    // setProperties(defaultValueBulkProps);
    // ^ для render|state|загрузки на МАССИВЕ
    setPropertiesArr([[]]);
  };

  // изначально получить с сервера списки Категорий/Брендов
  useEffect(() => {
    categoryAPI.getAllCategories().then((data) => setCategories(data));
    brandAPI.getAllBrands().then((data) => setBrands(data));
  }, []);

  // сохр.данн в state для масс.запроса от доп.ФормДат
  // ^ для render|state|загрузки на ОБЪЕКТЕ
  // const bulkHandleInputChange = (event: any) => {
  //   // console.log("hndlInp 000 event.target.name|value ", event.target?.name, event.target?.value);

  //   // запись доп.ФормДаты из state в перем.
  //   let data = {
  //     ...valueBulk,
  //   };

  //   console.log("hndlInp data 000 ", data);
  //   if (event.target.name) {
  //     // перебор парам.в data по key
  //     for (const key in data) {
  //       // выборка name,category,brand,price для записи
  //       if (key === event.target.name && event.target.name !== "image") {
  //         let num: number = 0;

  //         // ^ находим id formы родителя для опред.в какое место параметра массива записывать значение
  //         // имя
  //         if (event.target?.name === "name")
  //           num = Number(event.target.parentElement.id);
  //         // categor | brand | price | img
  //         if (
  //           event.target?.name === "category" ||
  //           event.target?.name === "brand" ||
  //           event.target?.name === "price"
  //         )
  //           num = Number(
  //             event.target.parentElement.parentElement.parentElement.id
  //           );

  //         // data[key].push(event.target.value);
  //         data[key][num] = event.target.value;
  //       }
  //       // выборка Изо для записи
  //       if (key === event.target.name && event.target.name === "image") {
  //         let num = Number(
  //           event.target.parentElement.parentElement.parentElement.id
  //         );
  //         // data[key] = { ...[key], ...event.target.files };
  //         // data[key].push(/* event.target.files[0].name, */ event.target.files[0]);
  //         data[key][num] = event.target.files[0];
  //       }
  //     }
  //     // console.log("hndlInp DATA 111 ", data);
  //     setValueBulk(data);
  //   }
  //   console.log("hndlInp valueBulk ", valueBulk);
  // };

  // ^ для render|state|загрузки на МАССИВЕ
  // ^ ДОБАВЛЕНИЕ // ? нужно ли ? может сразу в btn изменять ?
  const handlerAddBulkValue = () => {
    // добав.в state Продуктов шаблон Продукта на кажд.нов.ФормДату
    setValueBulkArr([...valueBulkArr, templateValueArr]);
    // добав.в state Хар-ик Продуктов шаблон Хар-ик на кажд.нов.ФормДату
    setPropertiesArr([...propertiesArr, []]);
  };

  // ^ УДАЛЕНИЕ
  const handlerDeleteBulkValue = (event: any) => {
    event.preventDefault();
    console.log("ARR DEL event ", event);

    // перем. id блока ФормДаты
    const idParentPropsNum = Number(
      event.target.parentElement.parentElement.parentElement.id
    );

    // ^ Продукт. Удал.эл.м/у эл-ми масс.(копир данные до и после indexa(idParentPropsNum))
    setValueBulkArr((existingItems: any) => {
      // для 0 indexa
      if (idParentPropsNum === 0) {
        return [...existingItems.slice(1)];
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

    // Характеристики Продукта. Удал.эл.м/у эл-ми масс.
    setPropertiesArr((existingItems: any) => {
      // для 0 indexa
      if (idParentPropsNum === 0) {
        return existingItems.slice(1); // ! existingItems.slice is not a function
      }
      // для всех остальных index
      else {
        return [
          ...existingItems.slice(0, idParentPropsNum),
          ...existingItems.slice(idParentPropsNum + 1),
        ];
      }
    });
  };

  // ^ ИЗМЕНЕНИЯ
  const handlerChangeBulkValue = (event: any) => {
    event.preventDefault();
    // запись доп.ФормДаты из state в перем.
    const dataProduct = [...valueBulkArr];

    // перем. Имени и Значения поля формы
    const nameForm = event.target.name;
    const valueForm = event.target.value;

    // перем.id блока события
    const idParentPropsNum = Number(
      event.target.parentElement.parentElement.parentElement.id
    );

    // выбор.в масс. объ.по id блока
    const idDataProduct = dataProduct[idParentPropsNum];
    // перебор объ.по key
    for (const key in idDataProduct) {
      // запись е/и key = name, кроме image
      if (key === nameForm && nameForm !== "image") {
        idDataProduct[key] = valueForm;
      }
      // запись е/и key = image
      if (key === nameForm && nameForm === "image") {
        idDataProduct[key] = event.target.files[0];
      }
    }

    // ^ обнов.сразу state (копир до и после indx и вставляя нов.объ. между)
    setValueBulkArr((existingItems: any) => {
      return [
        ...existingItems.slice(0, idParentPropsNum),
        idDataProduct,
        ...existingItems.slice(idParentPropsNum + 1),
      ];
    });
  };

  // ^ КОПИРОВАНИЕ
  const handlerCloneBulkValue = (event: any) => {
    event.preventDefault();
    // запись данн.ФормДат из state в перем.
    const dataProduct = [...valueBulkArr];
    const dataProps = [...propertiesArr];

    // перем.id блока события
    const idParentPropsNum = Number(
      event.target.parentElement.parentElement.parentElement.id
    );

    // выбор.в statах объ.Продукта/масс.Хар-ик по id блока ФормДаты
    const idDataProduct = dataProduct[idParentPropsNum];
    const idDataProps = dataProps[idParentPropsNum];

    // клоны Продукта/Хар-ик
    const cloneProduct = Object.assign({}, idDataProduct); // альтерн. { ...idDataProduct } | JSON.parse(JSON.stringify(idDataProduct))
    const cloneProps = JSON.parse(JSON.stringify(idDataProps)); // slice() | [...spread] копир.по ссылке т.к. в масс.объ (не подходят - измен.оба эл.)

    // убир.Имя и Изо из копии Продукта для уник.знач.
    for (const key in cloneProduct) {
      if (key === "name" || key === "image") cloneProduct[key] = "";
    }

    // запись в state после копир.эл.
    dataProduct.splice(idParentPropsNum + 1, 0, cloneProduct);
    setValueBulkArr(dataProduct);
    // setValueBulkArr((existingItems: any) => {
    //   return [
    //     ...existingItems.slice(0, idParentPropsNum),
    //     idDataProduct,
    //     cloneProduct,
    //     ...existingItems.slice(idParentPropsNum + 1),
    //   ];
    // });
    dataProps.splice(idParentPropsNum + 1, 0, cloneProps);
    setPropertiesArr(dataProps);
    // setPropertiesArr((existingItems: any) => {
    //   return [
    //     ...existingItems.slice(0, idParentPropsNum),
    //     idDataProps,
    //     cloneProps,
    //     ...existingItems.slice(idParentPropsNum + 1),
    //   ];
    // });
  };

  // ^ кнп.Сохранить(отправка/получ.данн.Сервера)
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
    if (correct.name && correct.price && correct.category && correct.brand) {
      console.log("SBM IF 1 ", 1);

      // ^ для render|state|загрузки на ОБЪЕКТЕ
      const formData = new FormData();
      for (const key in valueBulk) {
        if (key === "name") formData.append("name", valueBulk.name);
        if (key === "price") formData.append("price", valueBulk.price);
        if (key === "category")
          formData.append("categoryId", valueBulk.category);
        if (key === "brand") formData.append("brandId", valueBulk.brand);
        if (key === "image") {
          const imgLenght = valueBulk.image.length;
          for (let i = 0; i < imgLenght; i++) {
            formData.append(
              "image",
              valueBulk.image[i],
              valueBulk.image[i].name
            );
          }
        }
      }

      // ^ для render|state|загрузки на МАССИВЕ
      const formDataArr = new FormData();
      correctArr.map((fd: { [key: string]: any }) => {
        console.log("SBM ARR fd ", fd);
        // let resultArr = {}
        for (const key in fd) {
          // console.log("fd.name ", fd.name);
          console.log("SBM ARR key ", key);
          if (key === "name") formDataArr.append("name", fd.name);
          if (key === "price") formDataArr.append("price", fd.price);
          if (key === "category") formDataArr.append("categoryId", fd.category);
          if (key === "brand") formDataArr.append("brandId", fd.brand);
          // доп.проверка е/и нет ИЗО
          if (key === "image" && typeof fd.image !== "string")
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
      for (const /* pair */ [key, value] of pairs_2) {
        console.log("кажд кл./знач. pair ", `${key}: ${value}` /* pair */);
      }
      // вывод каждого масс.в объ.
      console.log(...pairs_2);
      // вывод Таблицы
      console.table([...pairs_2]);
      // вывод объ.со значениями
      console.log(Object.fromEntries(pairs_2));

      // характеристики нового Продукта
      // if (properties.length) {
      // ! врем.откл. проверку для отраб.масс.загр.Хар-ик Продукта
      // const props = properties.filter(
      //   (prop: any) => prop.name.trim() !== "" && prop.value.trim() !== ""
      // );
      // if (props.length) {
      if (propertiesArr) {
        formDataArr.append("props", JSON.stringify(propertiesArr));
      }

      // отправка/получение data на/с Сервера
      // createProduct(formData)
      productAPI
        .createProduct(formDataArr as any)
        .then((data) => {
          console.log("SBM CrePPP data ", data);
          // приводим форму в изначальное состояние
          event.target.image.value = "";
          resetValueAndValidAndVBulk();
          // закрываем модальное окно создания Продукта
          setShow(false);
          // изменяем состояние компонента списка Продуктов, чтобы в этом списке появился и новый Продукт
          setChange((state: any) => !state);
        })
        .catch((error) => alert(error.response.data.message));
    }
  };

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
        <Modal.Title style={{ position: "relative" }}>
          {valueBulkArr.length > 1 ? <>Новые Продукты</> : <>Новый Продукт</>}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form
          noValidate
          onSubmit={handleSubmit}
          // ! врем.стиль для расшир.отражения
          style={{ minWidth: "800px", border: "none", padding: "0" }}
        >
          {/* ФормДата для загр.1го Продукта */}
          {/* <div id="0">{FormsParam}</div> */}
          {/* доп.ФормДаты для масс.загр.Продуктов */}
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
          {valueBulkArr.map((product: any, index: any) => (
            // Комп // ! state чётко, но форма обн.на кажд.нажатие (вносится по 1ой букв/цифр)
            // <Fragment key={index}>
            // <FormsParamComp key={index} prop={prop} index={index} />
            // </Fragment>
            // перем. // ! state чётко, но render при удален убирает только последний эл.(нет считывания value из props)
            // <div id={index} key={index}>
            //   {FormsParam}
            // </div>
            // напрямую // * state чётко, render чётко
            <div
              key={index}
              id={index}
              style={{
                padding: "1rem",
                marginBottom: "1rem",
                borderRadius: "10px",
                border: "2px solid #490005",
              }}
            >
              {/* Название */}
              <div className="df df-row">
                <div className="df df-col">
                  <Form.Control
                    name="name"
                    value={product.name}
                    onChange={(e) => {
                      handlerChangeBulkValue(e);
                    }}
                    isValid={valid.name === true}
                    isInvalid={valid.name === false}
                    placeholder="Название Продукта..."
                    className="mb-3"
                  />
                </div>
              </div>
              {/* Категория/Бренд */}
              <div className="df df-row mb-3">
                <div className="df df-col">
                  <Form.Select
                    name="category"
                    value={product.category}
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
                </div>
                <div className="df df-col">
                  <Form.Select
                    name="brand"
                    value={product.brand}
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
                </div>
              </div>
              {/* Цена/Изо */}
              <div className="df df-row mb-3">
                <div className="df df-col">
                  <Form.Control
                    name="price"
                    value={product.price}
                    onChange={(e) => {
                      handlerChangeBulkValue(e);
                    }}
                    isValid={valid.price === true}
                    isInvalid={valid.price === false}
                    placeholder="Цена Продукта..."
                  />
                </div>
                <div className="df df-col">
                  <Form.Control
                    name="image"
                    type="file"
                    onChange={(e) => {
                      handlerChangeBulkValue(e);
                    }}
                    placeholder="Фото Продукта..."
                  />
                </div>
              </div>
              {/* // ^ ХАРАКТЕРИСТИКИ */}
              <CreateProperties
                index={index}
                propertiesArr={propertiesArr}
                setPropertiesArr={setPropertiesArr}
              />
              {/* // ^ кнп. УДАЛЕНИЯ | КОПИРОВАНИЯ */}
              {(valueBulkArr.length > 1 ||
                product.category ||
                product.brand) && (
                <div
                  className="df df-row mt-3"
                  style={{ marginBottom: "0rem !important" }}
                >
                  {/* е/и Продуктов больше 1го */}
                  {valueBulkArr.length > 1 && (
                    <div className="df df-col">
                      <button
                        type="submit"
                        className="btn--eg btn-danger--eg w-100"
                        onClick={(e) => {
                          handlerDeleteBulkValue(e);
                        }}
                      >
                        Убрать Продукт
                      </button>
                    </div>
                  )}
                  {
                    // е/и в Продукте есть значения то можно копир блок
                    (product.category || product.brand) && (
                      /* || propertiesArr[index][0]["name"] || propertiesArr[index][0]["value"] // ! не раб. чёт не отрабатывает  */
                      //
                      <div className="df df-col">
                        <button
                          type="submit"
                          className="btn--eg btn-primary--eg w-100"
                          onClick={(e) => {
                            handlerCloneBulkValue(e);
                          }}
                        >
                          Копировать Продукт
                        </button>
                      </div>
                    )
                  }
                </div>
              )}
            </div>
          ))}
          <div className="mt-2" style={{ display: "block" }}>
            {/* кнп.Добавить/Убрать Продукт */}
            <div className="df df-col mb-3 m0">
              <button
                type="submit"
                className="btn--eg btn-primary--eg w-100"
                onClick={() => {
                  handlerAddBulkValue();
                }}
              >
                Добавить Продукт
              </button>
            </div>
            <hr
              style={{
                margin: "1rem 0",
                order: "1px solid",
                opacity: "1",
                color: "var(--bord-hr)",
                borderTop: "2px solid",
              }}
            />
            {/* кнп.Сохранить */}
            <div className="df df-col">
              <button type="submit" className="btn--eg btn-success--eg w-100">
                Сохранить
              </button>
            </div>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CreateProduct;
