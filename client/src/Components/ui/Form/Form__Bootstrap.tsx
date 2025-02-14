import React, { ChangeEvent } from "react";
// import ReactDOM from "react-dom"; // ^ для рендр.эл. вне корн.эл.React

type FormFieldProps = {
  handleSubmit?: any;
  handleChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  value?: { [key: string]: string | number };
  valid?: any;
  label?: boolean;
  unionObj?: string[] | any;
  legend?: string;
  nonField?: boolean;
  body?: any;
  clForm?: string;
};

const Form__Bootstrap: React.FC<FormFieldProps> = ({
  handleSubmit, // кнп.обраб.формы
  handleChange, // обраб.изменений
  value, // объ.значений
  valid, // валидация input
  label, // подпись input
  unionObj, // массив объединений
  legend, // подпись набора полей
  nonField, // откл.набора полей
  body, // альтернатива value (Компонент/текст)
  clForm, // класс для formы
}) => {
  // `все объединённые`
  let allUnited: { [key: string]: string | number } = {};
  // `все необъединённые`
  let allUnUnited: { [key: string]: string | number } = {};

  // `массив всех объединенных`
  let arrayOfAllUnited: any; // Array<[string, string | number]> = [];
  // `массив всех не объединенных`
  let arrayOfAllUnUnited: any; // Array<[string, string | number]> = [];

  // е/и есть value и нет body
  if (value && !body) {
    // перебор объ.по ключам
    for (const key in value) {
      // наличие клича в масс.эл.объединения
      const isUnion: boolean = unionObj.includes(key);

      // эл.без группировки в один блок
      if (!isUnion) allUnUnited = { ...allUnUnited, [key]: value[key] };
      // эл.группировки в один блок
      if (isUnion) allUnited = { ...allUnited, [key]: value[key] };

      // преобразов.объ.в масс.с ключ/значение
      arrayOfAllUnited = Object.entries(allUnited);
      arrayOfAllUnUnited = Object.entries(allUnUnited);
    }
  }
  // console.log("arrayOfAllUnited ", arrayOfAllUnited);
  // console.log("arrayOfAllUnUnited ", arrayOfAllUnUnited);

  return (
    <>
      {/* <div className="form form--eg p4"> */}
      {/* <div className="container-fluid mt-3"> */}
      <div className="p4">
        <h4 className="mb-2">Complex Form</h4>
        <form className="form form--eg p-4">
          <div className="form-row">
            <div className="form-group col-sm-6">
              <label htmlFor="myEmail">Email</label>
              <input
                type="email"
                className="form-control"
                id="myEmail"
                placeholder="Email"
              />
            </div>
            <div className="form-group col-sm-6">
              <label htmlFor="myPassword">Password</label>
              <input
                type="password"
                className="form-control"
                id="myPassword"
                placeholder="Password"
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="inputAddress">Address</label>
            <input
              type="text"
              className="form-control"
              id="myAddress"
              placeholder="1234 Main St"
            />
          </div>
          <div className="form-group">
            <label htmlFor="inputAddress2">Address 2</label>
            <input
              type="text"
              className="form-control"
              id="myAddress2"
              placeholder="Apartment, studio, or floor"
            />
          </div>
          <div className="form-row">
            <div className="form-group col-sm-6">
              <label htmlFor="myCity">City</label>
              <input type="text" className="form-control" id="myCity" />
            </div>
            <div className="form-group col-sm-4">
              <label htmlFor="myState">State</label>
              <select id="myState" className="form-control">
                <option selected>Choose...</option>
                <option>...</option>
              </select>
            </div>
            <div className="form-group col-sm-2">
              <label htmlFor="myZip">Zip</label>
              <input type="text" className="form-control" id="myZip" />
            </div>
          </div>
          <div className="form-group">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="myCheck"
              />
              <label className="form-check-label" htmlFor="myCheck">
                Check me out
              </label>
            </div>
          </div>
          {/* <button type="submit" className="btn btn-primary"> */}
          <button
            type="submit"
            className="btn--eg btn-primary--eg btn-danger--eg"
            // className={`btn--eg btn-${
            //   MsgBtn === "Удалить" ? "danger" : "primary"
            // }--eg  ${!axis || axis === "col" ? "mt-3" : "ml-5"}`}
            // // блок.кнп. е/и пусты name/address или есть ошб.
            // disabled={
            //   valueArr[0][1] === "" || valueArr[1][1] === "" || !isFormValid
            // }
          >
            Войти
          </button>
        </form>
      </div>
      {/* </div> */}
    </>
  );
};

export default Form__Bootstrap;
