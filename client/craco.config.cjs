const path = require("path");
const autoprefixer = require("autoprefixer");

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // алиасы импортов (базов.п.проекта, п.ф.Компонентов)
      webpackConfig.resolve.alias = {
        ...webpackConfig.resolve.alias,
        // eslint-disable-next-line no-undef
        "@": path.resolve(process.cwd(), "src"),
        // eslint-disable-next-line no-undef
        "@Comp": path.resolve(__dirname, "src/Components"),
      };

      // от.ошб.SCSS в терминале - Deprecation The legacy JS API is deprecated and will be removed in Dart Sass 2.0.0. // ! не раб. - ошб.осталась
      const sassRule = webpackConfig.module.rules.find(
        (rule) => rule.test && rule.test.toString().includes("scss")
      );

      if (sassRule) {
        sassRule.use = sassRule.use.map((loader) => {
          if (loader.loader && loader.loader.includes("sass-loader")) {
            return {
              ...loader,
              options: {
                implementation: require("sass"), // использ.modern Dart Sass
                fiber: false, // откл.Fiber
              },
            };
          }
          return loader;
        });
      }

      return webpackConfig; // возврат конфигурации
    },
  },

  style: {
    postcss: {
      plugins: [autoprefixer], // авто.добав.prefixes
    },
  },
};
