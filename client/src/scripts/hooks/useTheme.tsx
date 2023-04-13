// ! по видео https://www.youtube.com/watch?v=2-Iex4XG_Zg
import { useState, useEffect } from "react";

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

  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
    localStorage.setItem("--theme", theme);
    window.dispatchEvent(new Event("storage"));
  }, [theme]);

  return { theme, setTheme };
};
