// ^ Форматирование/Сокращение данных

import { CategoryData } from "../types/api/catalog.types";

// Цена
export const formatPrice = (price: number): string => {
  if (price >= 1e9) return `${(price / 1e9).toFixed(2)} B`;
  if (price >= 1e6) return `${(price / 1e6).toFixed(2)} M`;
  return price.toLocaleString("ru-RU");
};

// Названия
export const formatName = (name: string): string => {
  const replacements: Record<string, string> = {
    Первая: "1-ая",
    Вторая: "2-ая",
    Третья: "3-я",
    " (копия)": " (=+1)",
    " (распозн)": " (р)",
    " (запут)": " (з)",
  };

  return Object.entries(replacements).reduce(
    (acc, [key, val]) => acc.replace(key, val),
    name
  );
};

// Категорий
export const formatCategory = (
  category: CategoryData
): string | JSX.Element => {
  const replacements: Record<string, string | JSX.Element> = {
    Букв: "Буква",
    Амбиграмм: "⇔",
    Молекул: "⚙",
    Смартфон: `${PhoneIcon}`,
  };

  return replacements[category.name.slice(0, -1)] || category.name;
};

// Иконка телефона вынесена в отдельный компонент
const PhoneIcon = () =>
  `<svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
    <path d="M11 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h6zM5 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H5z"/>
    <path d="M8 14a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
  </svg>`;
