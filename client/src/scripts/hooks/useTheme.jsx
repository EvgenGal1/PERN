// ! по видео https://www.youtube.com/watch?v=2-Iex4XG_Zg
import { useState, useLayoutEffect } from "react";

// проверка настроек системы для темы
const isThemeSistem = window?.matchMedia(
  "(prefers-color-scheme: dark)"
).matches;
const systemColorTheme = isThemeSistem ? "dark" : "light";
// console.log("systemColorTheme", systemColorTheme);

export const useTheme = () => {
  // сост Темы из LocStr или из Сист.Настр
  const [theme, setTheme] = useState(
    localStorage.getItem("--theme") || systemColorTheme
  ); // dark, light, natural
  // console.log("LocStr ", theme);

  useLayoutEffect(() => {
    document.body.setAttribute("data-theme", theme);
    localStorage.setItem("--theme", theme);
    window.dispatchEvent(new Event("storage"));
  }, [theme]);

  return { theme, setTheme };
};

// ! <сохран checked в localStorage(массив input[type=radio]) (из ЕжеСвет)>˅=======================================================================================˅
// function saveCheckedToLocalStorage(selector) {
//   // ! https://qna.habr.com/q/555513
//   // не дублируем код
//   function save(data) {
//     localStorage.setItem(selector, JSON.stringify(data));
//   }
//   // и не создаем тысячи функций в цикле а используем одну общую
//   function onChange(event) {
//     var element = event.target,
//       name = element.name,
//       value = element.value;
//     data[name] = value;
//     save(data);
//   }
//   var elements = document.querySelectorAll(selector),
//     data = localStorage.getItem(selector);
//   if (data) {
//     // если в сторадже что-то есть то можем и распарсить
//     data = JSON.parse(data);
//   } else {
//     // иначе парсить нельзя, будет ошибка присвоим дефолтное значение и сохраним
//     save((data = {}));
//   }
//   // вместо ненужного создания массива обратимся напрямую к прототипу
//   Array.prototype.forEach.call(elements, function (element) {
//     console.log("elements ", elements);
//     var name = element.name,
//       value = element.value;
//     if (data[name] === value) {
//       // если текущий элемент отмечен в сторадже то отметим и на странице
//       element.checked = true;
//     }
//     // навесим созданый вне цикла хандлер на событие
//     element.addEventListener("change", onChange);
//   });
//   // ??? не раб - попытка вывести умолчание в localStorage. надо разобратся в коде
//   // if (data[name] === "") {
//   // localStorage.setItem("_size12", "0");
//   // }
// }
// saveCheckedToLocalStorage("input[type=radio]");

// так же расмотреть смену темы по материалам:
// Тёмная тема в React с помощью Redux-toolkit - https://habr.com/ru/post/659491/
// Тёмная тема в React с использованием css переменных в scss - https://habr.com/ru/post/656995/
