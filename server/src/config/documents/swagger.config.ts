// ^ документация Swagger (swg)

import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Application } from 'express';
import path from 'path';

import { isDevelopment } from '../envs/env.consts';

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
        : [
            { url: `${process.env.SRV_URL}/${process.env.SRV_NAME}` },
            {
              url: `http://localhost:5000/${process.env.SRV_NAME}`,
              description: 'LOCAL server',
            },
          ],
    },
    // абсол.путь ф.маршрута с коммент.JSON/JSDoc/OpenAPI
    apis: [path.join(__dirname, '../../routes/**/*.{js,ts}')],
  };

  // спецификация swg в JSON
  const swaggerDocs = swaggerJSDoc(swaggerOptions) as any; /* | SwaggerSpec */

  // перем.> boolean знач.подробного лога
  const isMegaTest = process.env.MEGA_TEST === 'true';
  // проверка путей для отладки
  if (isMegaTest && isDevelopment) {
    console.log('[Swagger] аннотации в файлах:', swaggerOptions.apis);
    swaggerOptions.apis.forEach((pattern) => {
      const files = require('glob').sync(pattern);
      console.log(`[Swagger] файлы по паттерну ${pattern}:`, files);
    });
  }
  // логг.сгенерир.спеки
  if (isMegaTest && isDevelopment) {
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
      customfavIcon: `${process.env.SRV_URL}/swagger/icon.ico`,
      // объедин.стили Базовый/Кастомный
      customCssUrl: `${process.env.SRV_URL}/swagger/combined.css`,
      customJs: [
        'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.js',
      ],
    }),
  );
};
