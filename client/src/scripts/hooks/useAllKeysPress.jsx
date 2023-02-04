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
  // console.log("anyKeyPressed : " + anyKeyPressed); // нажимаемые клвш

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
    // console.log("3 : " + 3);
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
    // console.log("key 1: " + key);
    // Избежать этой функции, если эти два значения соответствуют
    // (Доказательство, что клавиша уже нажата).
    console.log("key : " + key);
    // console.log("1 : " + 1);
    // console.log("prevKey.current " + prevKey.current);
    // console.log("key 1 : " + key);
    // console.log("userKeys 1 " + userKeys);
    if (prevKey.current === userKeys) return;
    // console.log("2 : " + 2);
    // console.log("revKey  : " + prevKey);
    // console.log("revKey.current  : " + prevKey.current);
    // console.log("3 : " + 3);
    // console.log("key 3 : " + key);
    // console.log("userKeys 3 : " + userKeys);
    if (key === userKeys) {
      // console.log("4 : " + 4);
      // console.log("userKeys : " + userKeys);
      setKeyPress(true);
      // Установите Prevkey для будущей ссылки.
      prevKey.current = key;
      // console.log("key 2: " + key);
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
    // console.log("repeat 0: " + repeat);
    // Примечание: предотвращает запись двойного ключа в массиве
    if (repeat) return;

    // console.log("repeat 1: " + repeat);
    setAnyKeyPressed((prevState) => [...prevState, key]);
  };

  const upMultiHandler = ({ key }) => {
    // console.log("upMulti 0");
    // Примечание: необходимо снова позвонить в Set State из-за того, как работает состояние.
    // В противном случае потребуется, чтобы функция спешилась и переоценивает, что в порядке.
    setAnyKeyPressed((prevState) => [...prevState]);
    // console.log("upMulti 1");
    setAnyKeyPressed((prevState) => [
      // console.log("prevState : " + prevState),
      ...prevState.filter((item) => item !== key),
      // console.log("upMulti 2"),
    ]);
  };

  // `нажаты клавиши`
  const areKeysPressed = (
    keys = [], // массив клвш или 0 ?
    Pressed = [] // сост ? anyKeyPressed `любая нажатая клавиша`. в консоле - нажимаемые клвш
  ) => {
    // Создать новый массив
    const required = [...keys];

    // любой порядок'. Вернуть массив, который не имеет соответствующих предметов
    const anyOrder = required.filter((itemA) => {
      return !Pressed.some((itemB) => itemB === itemA);
    });

    // `порядок`. Проверяем, совпадают ли 'keys' и 'Pressed' и что входные записи для 'Pressed' идентичны по порядку.
    const inOrder =
      required.length === Pressed.length &&
      required.every((value, index) => {
        // console.log("===== : ");
        return value === Pressed[index];
      });

    let result;

    // Если «Порядок» не был установлен, используйте расчет «А -А -А -ОРУК».
    // В противном случае используйте расчет «inorder».
    !order ? (result = anyOrder.length === 0) : (result = inOrder);
    // console.log("result : " + result);
    // console.log("result : " + result);
    return result;
  };

  function Init() {
    // console.log("1 : " + 1);
    useEffect(() => {
      // console.log("2 : " + 2);
      // Если «ref» после инициализации имеет свойство «текущего», то это относится
      // к указанному элементу, в этом случае «элемент» должен ссылаться на это.
      // В противном случае продолжайте состояние по умолчанию (объект окна).
      const element = ref.current ? ref.current : ref;

      // Добавить слушателей событий
      element.addEventListener("keydown", settings.downHandler);
      element.addEventListener("keyup", settings.upHandler);
      //console.log('useAllKeyPress - hookAsMount');
      return () => {
        element.removeEventListener("keydown", settings.downHandler);
        element.removeEventListener("keyup", settings.upHandler);
        //console.log('useAllKeyPress - hookAsUnmount');
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
