import { useState } from "react";

// ^ посмотреть размер занятого LS (подробнее https://stackoverflow.com/questions/4391575/how-to-find-the-size-of-localstorage)
// Fn оценки размера LS
const calculateLocalStorageSize = () => {
  let totalSize = 0;

  Object.keys(localStorage).forEach((key) => {
    const itemSize = (localStorage[key].length + key.length) * 2; // умножение на 2 для байтов
    totalSize += itemSize;
    console.log(`${key.substr(0, 50)} = ${(itemSize / 1024).toFixed(2)} KB`);
  });
  console.log(`Total = ${(totalSize / 1024).toFixed(2)} KB`);
};

// оценка размера LS
calculateLocalStorageSize();

// Hook раб.с LS
export function useLocalStorageUH(
  key: string,
  initialValue: string | number | boolean | object
) {
  // сост.LS с fn опред.нач.сост.
  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === "undefined") return initialValue;

    try {
      // получ.LS по ключу, возвращ.parse или нач.сост.
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error: unknown) {
      throw new Error(
        `Не удалось проанализировать элемент localStorage: ${
          // unknown к т.Error > получ.св-в
          (error as Error).message
        }`
      );
    }
  });

  // Fn  устан.нов.знач. LS
  const setValue = (value: string | number | boolean | object) => {
    try {
      // при fn получ.нов.знач. или использ.переданное
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      // сохр.сост.
      setStoredValue(valueToStore);
      // сохр.в LS
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error: unknown) {
      throw new Error(
        `Не удалось установить элемент localStorage: ${
          // unknown к т.Error > получ.св-в
          (error as Error).message
        }`
      );
    }
  };
  return [storedValue, setValue];
}
