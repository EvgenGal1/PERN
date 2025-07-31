// ^ документация Swagger (swg)

import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Application } from 'express';
import path from 'path';

import { isDevelopment } from '../envs/env.consts';

// подроб.логи > тестирования
const MEGA_TEST_SWG = false;

// fn подкл. SWG UI
export const documentSwagger = (app: Application): void => {
  // конфиг.swg
  const swaggerOptions = {
    swaggerDefinition: {
      openapi: '3.0.0',
      info: {
        title: 'PERN Stack API',
        version: '2.2.1',
        description: 'Описание методов интеграции API',
      },
      // URL > req DEV/PROD
      servers: isDevelopment
        ? [
            {
              url: `${process.env.SRV_URL}/${process.env.SRV_NAME}`,
              description: 'DEV server',
            },
            {
              url: process.env.SRV_URL || 'http://localhost:5123',
              description: 'LOCAL server',
            },
          ]
        : [{ url: `${process.env.SRV_URL}` }],
    },
    // абсол.путь ф.маршрута с коммент.JSON/JSDoc/OpenAPI. Пути настр.под src/, dist/ с использ. process.cwd() > надежности на Vercel
    apis: [path.join(__dirname, '../../routes/**/*.{js,ts}')],
  };

  // спецификация swg в JSON
  const swaggerDocs = swaggerJSDoc(swaggerOptions) as any; /* | SwaggerSpec */

  // import SWG_UI внутри fn от проблем.с import в верхн.уровне/Vercel

  // проверка путей для отладки
  if (MEGA_TEST_SWG && isDevelopment) {
    console.log('[Swagger] аннотации в файлах:', swaggerOptions.apis);
    swaggerOptions.apis.forEach((pattern) => {
      const files = require('glob').sync(pattern);
      console.log(`[Swagger] файлы по паттерну ${pattern}:`, files);
    });
  }
  // логг.сгенерир.спеки
  if (MEGA_TEST_SWG && isDevelopment) {
    console.log(
      '[Swagger] Сгенерированная спека:',
      JSON.stringify(swaggerDocs, null, 2),
    );
  }
  // проверка путей в спеке
  if (!swaggerDocs.paths || Object.keys(swaggerDocs.paths).length === 0) {
    console.warn(
      '[Swagger] ВНИМАНИЕ: Сгенерированная спека не содержит путей (paths). Проверьте аннотации JSDoc в файлах маршрутов.',
    );
  }

  // подкл./кастомизация SWG UI
  app.use(
    '/swagger',
    // откл. serve передача масс.[] от обслуж.swagger-ui-express своих ф.
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocs, {
      // назв.стр. Swagger
      customSiteTitle: 'PERN API Docs (Swagger)',
      swaggerOptions: {
        // `постоянное разрешение` на использ.JWT Токен в swg
        persistAuthorization: true,
        // указ.URL > получ.спеки
        // url: '/swagger',
      },
      // кастом.иконки в браузере
      // customfavIcon: `/${process.env.PUB_DIR}/swagger/icon.ico`, //  ^ вроде все раб - проверил было - опять пропало
      customfavIcon: `/public/swagger/icon.ico`, //  ^ вроде все раб - проверил было - опять пропало
      // customfavIcon: `${process.env.SRV_URL}/${process.env.PUB_DIR}/swagger/icon.ico`,
      // customfavIcon: `${process.env.SRV_URL}/${process.env.PUB_DIR}/swagger/icon.ico`, //  ^ вроде все раб
      // кастом ф.CSS
      // customCss: `${process.env.SRV_URL}/swagger/theme.css`, // загр.ток.свои стили
      // customCssUrl: `https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css`, // загр.ток.базовые стили
      // customCssUrl: [
      //   'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css', // для отраб.статич.ф.на PROD - Vercel
      //   `${process.env.SRV_URL}/${process.env.PUB_DIR}/swagger/theme.css`,
      // ],  // ! ошб. - базовые + своё в setup не раб.масс > css
      // объедин.стили Базовый/Кастомный
      // customCss: combinedCss,
      // объедин.стили Базовый/Кастомный в ф.
      // customCssUrl: `${process.env.SRV_URL}/${process.env.PUB_DIR}/swagger/combined.css`,
      // customCssUrl: `${process.env.SRV_URL}/${process.env.PUB_DIR}/swagger/theme.css`,
      // customCssUrl: `/${process.env.PUB_DIR}/swagger/theme.css`,
      customCssUrl: `/public/swagger/theme.css`,
      // кастом ф.JS (для отраб.статич.ф.на PROD - Vercel)
      customJs: [
        'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.js',
      ],
    }),
  );
};
