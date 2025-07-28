// ^ документация Swagger (swg)

import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Application } from 'express';
import path from 'path';
import fs from 'fs';

import { isDevelopment } from '../envs/env.consts';

// fn подкл. swg UI
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
      servers: [
        {
          url:
            `${process.env.SRV_URL}/${process.env.SRV_NAME}` ||
            `http://localhost:5000/${process.env.SRV_NAME}`,
        },
      ],
    },
    // абсол.путь ф.маршрута с коммент.JSON
    apis: [path.join(__dirname, '../../routes/**/*.{js,ts}')],
  };

  // спецификация swg в JSON
  const swaggerDocs = swaggerJSDoc(swaggerOptions);

  // лог.объедин. базовых/кастомных стилей
  // загр.ф.кастом.stl из локалки
  let customCssContent = '';
  try {
    customCssContent = fs.readFileSync(
      path.join(__dirname, '../../../public/swagger/theme.css'),
      'utf8',
    );
    isDevelopment &&
      console.log('[Swagger] загр./чтение ф.кастом.стилей theme.css');
  } catch (error: unknown) {
    isDevelopment &&
      console.error(
        '[Swagger] Ошб. загр./чтен.ф. theme.css :',
        (error as Error).message,
      );
  }

  // объедин.стили
  const combinedCss = `
    /* базовые стили Swagger UI из CDN */
    @import url('https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css');

    /* кастомные стили */
    ${customCssContent}
  `;

  // подкл./кастомизация swg UI
  app.use(
    '/swagger',
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocs, {
      // назв.стр. Swagger
      customSiteTitle: 'PERN API Docs (Swagger)',
      swaggerOptions: {
        // `постоянное разрешение` на использ.JWT Токен в swg
        persistAuthorization: true,
      },
      // кастом иконки в браузере
      customfavIcon: `${process.env.SRV_URL}/swagger/icon.ico`,
      // кастом ф.CSS
      // customCss: `${process.env.SRV_URL}/swagger/theme.css`, // загр.ток.свои стили
      // customCssUrl: `https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css`, // загр.ток.базовые стили
      // customCssUrl: [
      //   'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css', // для отраб.статич.ф.на PROD - Vercel
      //   `${process.env.SRV_URL}/${process.env.PUB_DIR}/swagger/theme.css`,
      // ],  // ! ошб. - базовые + своё в setup не раб.масс > css
      customCss: combinedCss,
      // кастом ф.JS (для отраб.статич.ф.на PROD - Vercel)
      customJs: [
        'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.js',
      ],
    }),
  );
};
