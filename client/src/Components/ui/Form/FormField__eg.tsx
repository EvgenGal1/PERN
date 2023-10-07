import React from "react";
// import ReactDOM from "react-dom"; // ^ для рендр.эл. вне корн.эл.React

type FormFieldProps = {
  handleSubmit?: any;
  handleChange?: any;
  value?: any; // { [key: string]: string }; // | any[] | Record<string, any>; // [] | {};
  valid?: any;
  amount?: any;
  union?: any; // /* string[][] | string[] | */ string[]; //|number[];
  legend?: string;
  body?: any;
  cl?: any;
  nonField?: any;
};

const FormField__eg: React.FC<FormFieldProps> = ({
  handleSubmit,
  handleChange,
  value,
  valid,
  union,
  legend,
  body,
  cl,
  nonField,
  amount,
}) => {
  // `все объединённые`
  let allUnited: any = {};
  // `все необъединённые`
  let allUnUnited: any = {};

  // `массив всех объединенных`
  let arrayOfAllUnited: any = "";
  // `массив всех не объединенных`
  let arrayOfAllUnUnited: any = "";

  if (value && !body) {
    console.log("value && !body ", value && !body);
    for (var key in value) {
      const isUnion: any = union.includes(key);
      console.log("isUnion - key ", isUnion, "-", key);

      if (!isUnion) {
        allUnUnited = { ...allUnUnited, [key]: value[key] };
      }
      if (isUnion) {
        allUnited = { ...allUnited, [key]: value[key] };
      }

      arrayOfAllUnited = Object.entries(allUnited);
      arrayOfAllUnUnited = Object.entries(allUnUnited);
    }
  }

  return (
    <>
      <form
        noValidate
        onSubmit={handleSubmit}
        className={`form ${cl ? cl : ""}`}
      >
        <fieldset
          className={`df df-col fieldset--eg ${
            nonField ? "bbb-0" : "p-4 pt-3"
          }`}
        >
          {legend && <legend className="legend--eg">{legend}</legend>}
          {value &&
            !body &&
            arrayOfAllUnUnited.map((keyU: string) => (
              <input
                id={keyU}
                value={value[keyU[0]]}
                type="text"
                name={keyU[0]}
                onChange={handleChange}
                className={`inpt--eg mt-3 ${
                  valid.name === true
                    ? "is-valid"
                    : valid.name === false
                    ? "is-invalid"
                    : ""
                }${arrayOfAllUnUnited ? "df df-row" : ""}`}
                placeholder={`Отсутствуете ${keyU[0]}`}
              />
            ))}
          {value && !body && arrayOfAllUnited && (
            <div className="df df-row df-jcsb mt-3">
              {arrayOfAllUnited.map((keyU: string) => (
                <input
                  id={keyU}
                  value={value[keyU[0]]}
                  type="text"
                  name={keyU[0]}
                  onChange={handleChange}
                  className={`inpt--eg ${
                    valid.name === true
                      ? "is-valid"
                      : valid.name === false
                      ? "is-invalid"
                      : ""
                  }`}
                  placeholder={`Отсутствуете ${keyU[0]}`}
                />
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
