import js from "@eslint/js"; // базовые правила ESLint
import globals from "globals"; // глобал.перем.окруж.
import tsParser from "@typescript-eslint/parser"; // парсер
import tsPlugin from "@typescript-eslint/eslint-plugin"; // плагин TypeScript
import reactPlugin from "eslint-plugin-react"; // плагин React
import reactRecommended from "eslint-plugin-react/configs/recommended.js"; // рекомендации React
import jsxA11yPlugin from "eslint-plugin-jsx-a11y"; // плагин доступности
import eslintPluginPrettier from "eslint-plugin-prettier"; // плагин Prettier

export default [
  // рекомендации/правила ESLint/React
  js.configs.recommended,
  reactRecommended,
  {
    // форматы ф.> поверки
    files: ["./src/*.{js,jsx,ts,tsx}"],
    // пути игнора
    ignores: ["**/vr/**", "**/dist/**", "**/node_modules/**", "*.config.*"],
    // настр.язык.окружения
    languageOptions: {
      // парсер TypeScript (обязательно для TS)
      parser: tsParser,
      // настр.парсера
      parserOptions: {
        ecmaVersion: "latest", // послед.v.ECMAScript
        sourceType: "module", // модульная
        ecmaFeatures: { jsx: true }, // поддержка JSX
        project: "./tsconfig.json", // путь к tsconfig
      },
      // глобал.переменные
      globals: {
        ...globals.browser, // браузер (window, document,)
        ...globals.node, // NodeJS (module, process,)
        JSX: "readonly", // тип JSX для TS
        console: "readonly", // разрешение console.log
      },
    },
    // плагины (React, TypeScript, Prettier)
    plugins: {
      react: reactPlugin,
      "@typescript-eslint": tsPlugin,
      prettier: eslintPluginPrettier,
      "jsx-a11y": jsxA11yPlugin,
    },
    // правила. off - откл., warn - предупреждение, error - запрет/ошб.
    rules: {
      // React
      "react/react-in-jsx-scope": "off", // не требовать импорт React в JSX
      "react-hooks/rules-of-hooks": "warn", // проверка хуков // ^ error
      "react-hooks/exhaustive-deps": "warn", // проверка зависимостей эффектов
      // TypeScript
      "@typescript-eslint/no-unused-vars": "warn", // неиспользуемые переменные
      "@typescript-eslint/no-explicit-any": "warn", // тип any
      // JavaScript
      "no-console": "off", // запрет console.log
      // Prettier
      "prettier/prettier": "error", // автоопред.переносов строк
      // Доступность
      "jsx-a11y/anchor-is-valid": "warn", // валидность якорей (ссылки `<a>` без href)
      "jsx-a11y/no-redundant-roles": "warn", // избегать избытка роли/событий/обработчикм в эл.
      // 'jsx-a11y/media-has-caption': 'warn', // медиа элементы
    },
    // доп.настр.
    settings: {
      react: {
        version: "detect", // автоопред.v.React
      },
      // раб.с алиасами из tsconfig
      "import/resolver": {
        typescript: {
          project: "./tsconfig.json", // настр.TS
          alwaysTryTypes: true, // всегда пытаться найти типы
        },
      },
    },
  },
];
