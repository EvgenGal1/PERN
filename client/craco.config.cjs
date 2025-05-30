const path = require("path");
const autoprefixer = require("autoprefixer");

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // алиасы импортов (базов.п.проекта, п.ф.Компонентов)
      webpackConfig.resolve.alias = {
        ...webpackConfig.resolve.alias,
        // eslint-disable-next-line no-undef
        "@/": path.resolve(process.cwd(), "src"),
        // eslint-disable-next-line no-undef
        "@api/": path.resolve(__dirname, "src/api"),
        // eslint-disable-next-line no-undef
        "@Comp/": path.resolve(__dirname, "src/Components"),
      };

      // настр. sass-loader > использ. dart-sass от.ошб.SCSS в терминале - Deprecation The legacy JS API is deprecated and will be removed in Dart Sass 2.0.0. // ! не раб. - ошб.осталась
      const sassRule = webpackConfig.module.rules.find(
        (rule) => rule.test && rule.test.toString().includes("scss")
      );

      if (sassRule) {
        sassRule.use.forEach((loader) => {
          if (
            typeof loader === "object" &&
            loader.loader &&
            loader.loader.includes("sass-loader")
          ) {
            loader.options = {
              implementation: require("sass"), // использ.modern Dart Sass
              sassOptions: {
                fiber: false, // откл.Fiber (необязательно)
              },
            };
          }
        });
      }

      // путь к выходным файлам корректен
      webpackConfig.output = {
        ...webpackConfig.output,
        publicPath: "/", // Для корневого деплоя
        filename: "static/js/[name].[contenthash:8].js",
        chunkFilename: "static/js/[name].[contenthash:8].chunk.js",
      };

      return webpackConfig; // возврат обнов.конфигурации
    },
  },

  style: {
    postcss: {
      plugins: [autoprefixer], // авто.добав.vendor prefixes
    },
  },
};
