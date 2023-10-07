import React, { ChangeEvent } from "react";
// import ReactDOM from "react-dom"; // ^ для рендр.эл. вне корн.эл.React

type FormFieldProps = {
  handleSubmit?: any;
  handleChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  value?: { [key: string]: string | number };
  valid?: any;
  label?: boolean;
  union?: string[] | any;
  legend?: string;
  nonField?: boolean;
  body?: any;
  clT?: string;
};

const FormField__eg: React.FC<FormFieldProps> = ({
  handleSubmit, // кнп.обраб.формы
  handleChange, // обраб.изменений
  value, // объ.значений
  valid, // валидация input
  label, // подпись input
  union, // массив объединений
  legend, // подпись набора полей
  nonField, // откл.набора полей
  body, // альтернатива value (Компонент/текст)
  clT, // класс для formы
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
    for (var key in value) {
      // наличие клича в масс.эл.объединения
      const isUnion: boolean = union.includes(key);

      // эл.без группировки в один блок
      if (!isUnion) allUnUnited = { ...allUnUnited, [key]: value[key] };
      // эл.группировки в один блок
      if (isUnion) allUnited = { ...allUnited, [key]: value[key] };

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
        className={`form ${clT ? clT : ""}`}
      >
        <fieldset
          className={`df df-col fieldset--eg ${
            nonField ? "bbb-0" : "p-4 pt-3"
          }`}
        >
          {legend && <legend className="legend--eg">{legend}</legend>}
          {/* // ^ разраб.отраб.из 1го списка, чтоб объединёные эл.могли быть по середине */}
          {/* // ^ раб код, но 2 отдельных списка. Без признака объединения из масс.union сверху, объединённые снизу */}
          {value &&
            !body &&
            arrayOfAllUnUnited.map((keyU: string) => (
              <div
                key={keyU[0]}
                className={`mt-3 ${label ? "df df-jcsb df-aic" : ""}`}
              >
                {label && (
                  <label
                    htmlFor={keyU[0]}
                    className={`${label ? "w10 tal" : ""}`}
                  >
                    {keyU[0]}
                  </label>
                )}
                <input
                  id={keyU[0]}
                  value={value[keyU[0]]}
                  type="text"
                  name={keyU[0]}
                  onChange={handleChange}
                  className={`inpt--eg w100 ${
                    valid.name === true
                      ? "is-valid"
                      : valid.name === false
                      ? "is-invalid"
                      : ""
                  } ${label ? "ml-3" : ""}`}
                  // }`}
                  placeholder={`Отсутствуете ${keyU[0]}`}
                />
              </div>
            ))}
          {value && !body && arrayOfAllUnited && (
            <div className="df df-row df-jcsb mt-3">
              {arrayOfAllUnited.map((keyU: string) => (
                <div
                  key={keyU[0]}
                  className={`${label ? "df df-jcsb df-aic w100" : ""}`}
                >
                  {label && (
                    <label
                      htmlFor={keyU[0]}
                      className={`${label ? "w10 tal" : ""}`}
                    >
                      {keyU[0]}
                    </label>
                  )}
                  <input
                    id={keyU[0]}
                    value={value[keyU[0]]}
                    type="text"
                    name={keyU[0]}
                    onChange={handleChange}
                    className={`inpt--eg w100 ${
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
          )}
          {!value && body ? body : ""}
        </fieldset>
      </form>
    </>
  );
};

export default FormField__eg;
