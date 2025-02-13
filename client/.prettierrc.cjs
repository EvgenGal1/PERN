module.exports = {
  semi: true, // точка с запятой в конце строк
  singleQuote: false, // одинарные кавычки
  tabWidth: 2, // размер табуляции
  trailingComma: "es5", // запятые по v.ECMAScript
  printWidth: 80, // макс.ширина строки
  endOfLine: "lf", // стиль переноса. lf по Git
  arrowParens: "always", // синтакс стрел.fn. `всегда` есть скобки
  plugins: [
    // "prettier-plugin-organize-imports", // автоорганизация импортов
    // "prettier-plugin-tailwindcss", плагин Tailwind
  ],
  overrides: [
    {
      files: "*.{css,scss}", // настр.ф.CSS/SCSS
      options: {
        singleQuote: false, // двойные кавычки
        tabWidth: 2,
        parser: "scss", // указ.парсер > SCSS
      },
    },
    {
      files: "*.json",
      options: {
        tabWidth: 2,
      },
    },
  ],
};
