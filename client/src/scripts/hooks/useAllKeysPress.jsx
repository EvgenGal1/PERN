// !!! https://codesandbox.io/s/multiple-keys-in-order-vpovi?file=/src/App.js
import { useState, useEffect, useRef } from "react";

function useAllKeysPress(options) {
  // убедитесь, что «параметры» это объект
  if (!options || Object.keys(options).length === 0) {
    throw new Error(
      `Параметр объекта не найден использование: {userkeys: ...}`
    );
  }

  // Свойства «Параметры».
  const userKeys = options.userKeys || null;
  const order = options.order || false;
  const ref = options.ref || window;

  // Реагировать крючки.
  const [keyPress, setKeyPress] = useState(false);
  const [anyKeyPressed, setAnyKeyPressed] = useState([]); // новое с массивами

  // Ссылка, чтобы определить, была ли уже нажата клавиша.
  const prevKey = useRef("");

  const settings = {
    type: null,
    objRef: ref,
    downHandler: undefined,
    upHandler: undefined,
    useEffect: null,
    output: null,
  };

  const setData = (settings) => {
    // Убедитесь, что у нас есть свойство «пользователя»
    if (userKeys) {
      // Проверьте, является ли объект строкой, если это так
      // «Опция» объект.
      if (typeof userKeys === "string") {
        settings.output = keyPress;
        settings.downHandler = downHandler;
        settings.upHandler = upHandler;
        settings.useEffect = Init;
        settings.type = "STRING";
      }
      // Проверьте, является ли объект массивом, если это так, добавьте свойства Multikeys
      // «Опция» объект.
      if (Array.isArray(userKeys)) {
        settings.output = areKeysPressed(userKeys, anyKeyPressed);
        settings.downHandler = downMultiHandler;
        settings.upHandler = upMultiHandler;
        settings.useEffect = Init;
        settings.type = "ARRAY";
      }
      if (Number.isInteger(userKeys)) {
        throw new Error(
          `Invalid 'userKeys' property: must be {userKeys:'KEY'} or {userKeys:[KEY, ...]}`
        );
      }
    } else {
      throw new Error(
        `Invalid 'userKeys' property: must be {userKeys:'KEY'} or {userKeys:[KEY, ...]}`
      );
    }

    return settings;
  };

  const downHandler = ({ key }) => {
    // Избежать этой функции, если эти два значения соответствуют
    // (Доказательство, что клавиша уже нажата).
    if (prevKey.current === userKeys) return;
    if (key === userKeys) {
      setKeyPress(true);
      // Установите Prevkey для будущей ссылки.
      prevKey.current = key;
    }
  };

  const upHandler = ({ key }) => {
    if (key === userKeys) {
      setKeyPress(false);
      // сбросить ценность предварительного
      prevKey.current = "";
    }
  };

  const downMultiHandler = ({ key, repeat }) => {
    // Примечание: предотвращает запись двойного ключа в массиве
    if (repeat) return;

    setAnyKeyPressed((prevState) => [...prevState, key]);
  };

  const upMultiHandler = ({ key }) => {
    // Примечание: необходимо снова позвонить в Set State из-за того, как работает состояние.
    // В противном случае потребуется, чтобы функция спешилась и переоценивает, что в порядке.
    setAnyKeyPressed((prevState) => [...prevState]);
    setAnyKeyPressed((prevState) => [
      ...prevState.filter((item) => item !== key),
    ]);
  };

  // `нажаты клавиши`
  const areKeysPressed = (
    keys = [], // массив клвш или 0 ?
    Pressed = [] // сост ? anyKeyPressed `любая нажатая клавиша`. в консоле - нажимаемые клвш
  ) => {
    // console.log("usKeyPress areKeysPressed keys ", keys);
    // console.log(keys);
    // console.log("usKeyPress areKeysPressed Pressed ", Pressed);
    // console.log(Pressed);
    // Создать новый массив
    const required = [...keys];
    // console.log("usKeyPress areKeysPressed required ", required);

    // `любой порядок'. Вернуть массив, который не имеет соответствующих предметов
    const anyOrder = required.filter((itemA) => {
      // console.log("usKeyPress areKeysPressed  itemA ", itemA);
      // console.log(itemA);
      return !Pressed.some((itemB) => itemB === itemA);
    });

    // `порядок`. Проверяем, совпадают ли 'keys' и 'Pressed' и что входные записи для 'Pressed' идентичны по порядку.
    const inOrder =
      required.length === Pressed.length &&
      required.every((value, index) => {
        return value === Pressed[index];
      });

    let result;

    // Если «Порядок» не был установлен, используйте расчет «А -А -А -ОРУК».
    // В противном случае используйте расчет «inorder».
    !order ? (result = anyOrder.length === 0) : (result = inOrder);
    return result;
  };

  function Init() {
    useEffect(() => {
      // Если «ref» после инициализации имеет свойство «текущего», то это относится
      // к указанному элементу, в этом случае «элемент» должен ссылаться на это.
      // В противном случае продолжайте состояние по умолчанию (объект окна).
      const element = ref.current ? ref.current : ref;

      // console.log("usKeyPress element ", element);
      // console.log("usKeyPress ref ", ref);
      // console.log("usKeyPress ref.current ", ref.current);

      // Добавить слушателей событий
      element.addEventListener("keydown", settings.downHandler);
      element.addEventListener("keyup", settings.upHandler);
      return () => {
        element.removeEventListener("keydown", settings.downHandler);
        element.removeEventListener("keyup", settings.upHandler);
      };
    }, []); // Пустое массив гарантирует, что эффект работает только на креплении и разоблачении
  }

  /**
   * Настройте объект «Настройки».
   */
  setData(settings);

  /**
   * Инициализировать слушателей событий
   */
  settings.useEffect();

  /**
   * Возвращает «логическое» значение с входов клавиатуры
   */
  return settings.output;
}

export { useAllKeysPress };
