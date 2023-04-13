import { useState, useEffect } from "react";

// проверка настроек системы для размеров
const isPrefersSistem = window?.matchMedia(
  "(prefers-reduced-motion: no-preference)"
).matches;
const systemSize = isPrefersSistem ? "mid" : "big";

export const useSize = () => {
  // сост Темы из LocStr или из Сист.Настр
  const [size, setSize] = useState(
    localStorage.getItem("--size") || systemSize
  ); // big, mid, small, off
  // console.log("LocStr ", size);

  useEffect(() => {
    document.body.setAttribute("data-size", size);
    localStorage.setItem("--size", size);
    window.dispatchEvent(new Event("storage"));
  }, [size]);

  return { size, setSize };
};
