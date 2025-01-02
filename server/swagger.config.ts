// ^ документация Swagger (swg)

import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

// Fn подкл. swg UI
export const documentSwagger = (app: Express) => {
  // конфиг.swg
  const swaggerOptions = {
    swaggerDefinition: {
      openapi: '3.0.0',
      info: {
        title: 'PERN | PostgreSQL, Express, React, NodeJS',
        version: '2.1.0',
        description: 'Описание методов интеграции API',
      },
      servers: [{ url: process.env.SRV_URL }],
    },
    // путь ф.с коммент.JSON
    apis: ['./routes/**/*.ts'],
  };

  // спецификация swg в JSON
  const swaggerDocs = swaggerJSDoc(swaggerOptions);

  // подкл./кастомизация swg UI
  app.use(
    '/swagger',
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocs, {
      swaggerOptions: {
        // `постоянное разрешение` на использ.JWT Токен в swg
        persistAuthorization: true,
      },
      customSiteTitle: 'PERN (Swagger)',
      // кастом иконки в браузере
      customfavIcon: `${process.env.SRV_URL}/${process.env.PUB_DIR}/img/ico/icon.ico`,
      // кастом ф.CSS
      customCssUrl: `${process.env.SRV_URL}/${process.env.PUB_DIR}/swagger/theme.css`,
      // customCssUrl: [
      //   'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css', // для отраб.статич.ф.на PROD - Vercel
      //   `${process.env.SRV_URL}/${process.env.PUB_DIR}/swagger/theme.css`, // темы + своё
      // ],  // ! ошб. - не раб.масс > css
      // кастом ф.JS (для отраб.статич.ф.на PROD - Vercel)
      customJs: [
        'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.js',
      ],
    }),
  );
};
