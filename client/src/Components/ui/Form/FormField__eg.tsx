import React, { ChangeEvent } from "react";
// import ReactDOM from "react-dom"; // ^ для рендр.эл. вне корн.эл.React

type FormFieldProps = {
  handleSubmit?: any;
  MsgBtn?: string;
  handleSubmitBtnField?: any;
  MsgBtnField?: string;
  handleChange?: any; // (e: ChangeEvent<HTMLInputElement>) => void;
  valueObj?: { [key: string]: string | number };
  valueArr?: any; // [[key: string | number], string | number|[]]
  valid?: any;
  label?: boolean;
  unionObj?: string[] | any;
  legend?: string;
  nonField?: boolean;
  body?: any;
  clForm?: string;
  clField?: string;
  axis?: string;
};

const FormField__eg: React.FC<FormFieldProps> = ({
  handleSubmit, // кнп.обраб.ВНЕ формы
  MsgBtn, // СМС кнп.обраб.ВНЕ форме
  handleSubmitBtnField, // кнп.обраб.ВНУТРИ формы
  MsgBtnField, // СМС кнп.обраб.ВНУТРИ формы
  handleChange, // обраб.изменений
  valueObj, // объект значений
  valueArr, // массив значений
  valid, // валидация input
  label, // подпись input
  unionObj, // массив объединений для объекта valueObj
  legend, // подпись/вкл. набора полей
  // nonField, // откл.набора полей // * мжн.удал.
  body, // альтернатива valueObj (Компонент/текст)
  clForm, // класс для formы
  clField, // класс для набора полей
  axis = "col", // направление оси расположения эл.(по умолч.вертикально)
}) => {
  // `все объединённые`
  let allUnited: { [key: string]: string | number } = {};
  // `все необъединённые`
  let allUnUnited: { [key: string]: string | number } = {};

  // `массив всех объединенных`
  let arrayOfAllUnited: any; // Array<[string, string | number]> = [];
  // `массив всех не объединенных`
  let arrayOfAllUnUnited: any; // Array<[string, string | number]> = [];

  // е/и есть valueObj и нет body
  if (valueObj && !body) {
    // перебор объ.по ключам
    for (var key in valueObj) {
      // наличие клича в масс.эл.объединения
      const isUnion: boolean = unionObj.includes(key);

      // эл.без группировки в один блок
      if (!isUnion) allUnUnited = { ...allUnUnited, [key]: valueObj[key] };
      // эл.группировки в один блок
      if (isUnion) allUnited = { ...allUnited, [key]: valueObj[key] };

      // преобразов.объ.в масс.с ключ/значение
      arrayOfAllUnited = Object.entries(allUnited);
      arrayOfAllUnUnited = Object.entries(allUnUnited);
    }
  }

  return (
    <>
      <form
        noValidate
        onSubmit={handleSubmit}
        className={`form ${clForm ? clForm : ""}`}
      >
        <fieldset
          className={`fieldset--eg df ${
            axis === "row" ? "df-row df-jcsb" : "df-col"
          } ${!legend ? "bbb-0" : "p-4 pt-3"}`}
        >
          {legend && <legend className="legend--eg">{legend}</legend>}
          {/* // ^ раб.код на массиве(valueArr) */}
          {valueArr &&
            !body &&
            valueArr.map((keyU: any) => (
              <>
                {/* // ^ объединённые (united) */}
                {Array.isArray(keyU[0]) ? (
                  <div key={keyU} className="united df df-row df-jcsb mt-3">
                    {keyU.map((keyUm: any) => {
                      return (
                        <div
                          key={keyUm[0]}
                          className={`${
                            label ? "df df-jcsb df-aic w-100" : ""
                          }`}
                        >
                          {label && (
                            <label
                              htmlFor={keyUm[0]}
                              className={`${label ? "w-5 tal ml- mr-3" : ""}`}
                            >
                              {keyUm[0]}
                            </label>
                          )}
                          <input
                            id={keyUm[0]}
                            value={[keyUm[1]]}
                            type="text"
                            name={keyUm[0]}
                            onChange={handleChange}
                            className={`inpt--eg w-100 ${
                              valid.name === true
                                ? "is-valid"
                                : valid.name === false
                                ? "is-invalid"
                                : ""
                            } ${label ? "ml-3" : ""}`}
                            placeholder={`Отсутствуете ${keyUm[0]}`}
                          />
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  // ^ не объединённые (ununited)
                  <div
                    key={keyU[0]}
                    className={`ununited w-100 ${clField ? clField : ""} ${
                      label ? "df df-jcsb df-aic" : ""
                    } ${axis === "row" ? "df-jcse" : "mt-3"}`}
                  >
                    {label && (
                      <label
                        htmlFor={keyU[0]}
                        className={`${label ? "w-5 tal mr-3" : ""} ${
                          clField ? clField : ""
                        } `}
                      >
                        {keyU[0]}
                      </label>
                    )}
                    <input
                      id={keyU[0]}
                      value={[keyU[1]]}
                      type="text"
                      name={keyU[0]}
                      onChange={handleChange}
                      className={`inpt--eg ${
                        axis === "row"
                          ? label
                            ? "w-75 ml-3 mr-3"
                            : "w-100 mr-3"
                          : label
                          ? "w-100 ml-3"
                          : "w-100"
                      } `}
                      placeholder={`Отсутствуете ${keyU[0]}`}
                    />
                  </div>
                )}
              </>
            ))}
          {/* // ^ раб.код на объекте(valueObj). но 2 отдельных списка. Из масс.объедин.unionObj - без признака объединения(нет в unionObj)  отрис.сверху, с признаком снизу */}
          {/* {valueObj &&
            !body &&
            arrayOfAllUnUnited.length !== 0 &&
            arrayOfAllUnUnited.map((keyU: string) => { 
              return (
                <div
                  key={keyU[0]}
                  className={`ununited mt-3 ${
                    label ? "df df-jcsb df-aic" : ""
                  }`}
                >
                  {label && (
                    <label
                      htmlFor={keyU[0]}
                      className={`${label ? "w-5 tal" : ""}`}
                    >
                      {keyU[0]}
                    </label>
                  )}
                  <input
                    id={keyU[0]}
                    value={valueObj[keyU[0]]}
                    type="text"
                    name={keyU[0]}
                    onChange={handleChange}
                    className={`inpt--eg w-100  ${label ? "ml-3" : ""}`}
                    placeholder={`Отсутствуете ${keyU[0]}`}
                  />
                </div>
              );
            })}
          {valueObj && !body && arrayOfAllUnited.length !== 0 && (
            <div className="united df df-row df-jcsb mt-3">
              {arrayOfAllUnited.map((keyU: string) => (
                <div
                  key={keyU[0]}
                  className={`${label ? "df df-jcsb df-aic w-100" : ""}`}
                >
                  {label && (
                    <label
                      htmlFor={keyU[0]}
                      className={`${label ? "w-5 tal" : ""}`}
                    >
                      {keyU[0]}
                    </label>
                  )}
                  <input
                    id={keyU[0]}
                    value={valueObj[keyU[0]]}
                    type="text"
                    name={keyU[0]}
                    onChange={handleChange}
                    className={`inpt--eg w-100 ${
                      valid.name === true
                        ? "is-valid"
                        : valid.name === false
                        ? "is-invalid"
                        : ""
                    } ${label ? "ml-3" : ""}`}
                    placeholder={`Отсутствуете ${keyU[0]}`}
                  />
                </div>
              ))}
            </div>
          )} */}
          {/* // ^ е/и  есть body (переданый компонент) */}
          {!valueObj && !valueArr && body ? body : ""}
          {/* // ^ ВНТР.КНП. */}
          {handleSubmitBtnField !== false &&
            handleSubmitBtnField !== undefined && (
              <button
                type="submit"
                className={`btn--eg btn-${
                  MsgBtnField === "Удалить" ? "danger" : "primary"
                }--eg  ${!axis || axis === "col" ? "mt-3" : "ml-3"}`}
              >
                {MsgBtnField}
              </button>
            )}
        </fieldset>
        {/* // ^ ВНЕШН.КНП. */}
        {handleSubmit !== false && handleSubmit !== undefined && (
          <button
            type="submit"
            className={`btn--eg btn-${
              MsgBtn === "Удалить" ? "danger" : "primary"
            }--eg mt-3`}
          >
            {MsgBtn}
          </button>
        )}
      </form>
    </>
  );
};

export default FormField__eg;
