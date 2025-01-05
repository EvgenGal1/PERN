// ^ конфигурация Jest для тестирования серверной части приложения

module.exports = {
  preset: 'ts-jest', // раб.с TS с авто.трансформ.ф.
  testEnvironment: 'node', // среда выполнения ('jsdom' > front)
  transform: {
    // трансформ.ф.с расшир. .ts/tsx
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.json', // обраб. ч/з tsconfig
        isolatedModules: true, // откл.проверку типов
        diagnostics: false, // откл.диагностику
      },
    ],
  },

  testPathIgnorePatterns: ['/node_modules/', '/dist/'], // игнор.пути
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.ts$', //  регул.выраж. > нахождения ф.тестов
  moduleFileExtensions: ['ts', 'js', 'json', 'node'], // поддержка расширений
};
