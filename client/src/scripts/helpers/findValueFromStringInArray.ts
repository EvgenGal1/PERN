// ^ написать fn (в helperы) по проверке/вставке/замене чего либо (str<>num<>obj) в чём либо (str<>arr<>obj). принимает 3+1 парам.(что, в чём, fn(ревёрс, удал, добав, наличие), ? разделитель)
// запись name в state по знач.стр. поиск name в масс.объ. по совпадению id и значения из строки и подтягивания name в отд.перем. ч/з разделитель
interface ArrayObject {
  id: number;
  name: string;
}

export function findValueFromStringInArray(
  string: string,
  array: ArrayObject[]
) {
  // console.log("hlp findValue string | array ", string, array);
  // перем. разбития строка на части, масс.Имён
  const digits = string.split("_");
  const names: string[] = [];
  // перебор масс.по кол-ву знач.в строке
  for (let i = 0; i < digits.length; i++) {
    const digit = parseInt(digits[i]);
    // ищем объект с соответствующим id
    const matchingObject = array.find((obj: ArrayObject) => obj.id === digit);
    // е/и есть соответ. и такого имени ещё нет, добав.name в масс
    if (matchingObject && !names.includes(matchingObject.name)) {
      names.push(matchingObject.name);
    }
  }
  // соед.имена ч/з разделитель
  const result = names.join("_");
  return result;
}
