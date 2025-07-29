// // ^ документация Swagger (swg)

// import swaggerJSDoc from 'swagger-jsdoc';
// // import swaggerUi from 'swagger-ui-express';
// import { Application } from 'express';
// import path from 'path';
// import fs from 'fs';

// import { isDevelopment } from '../envs/env.consts';

// // перем. > стилей Базовый/Кастомный в str
// let defaultSwaggerCss = '';
// let customCssContent = '';

// // URL/путь загр.ф.стилей
// const CSS_URL =
//   'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css';
// const CSS_PATH_LOCAL = path.join(
//   __dirname,
//   isDevelopment
//     ? // ? `../../../${process.env.PUB_DIR}/swagger/theme.css`
//       `../../../public/swagger/theme.css`
//     : `../../${process.env.PUB_DIR}/swagger/theme.css`,
// );
// // подроб.логи >  тестирования
// const MEGA_TEST_SWG = false;

// /**
//  * загр.стилей при старте до SWG UI
//  */
// export const loadSwaggerStyles = async () => {
//   try {
//     // загруз.Базового CSS
//     const res = await fetch(CSS_URL);
//     if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
//     defaultSwaggerCss = await res.text();
//     MEGA_TEST_SWG &&
//       isDevelopment &&
//       console.log('[Swagger] Базовые стили загружены.');
//     // загруз.Кастомного CSS
//     if (fs.existsSync(CSS_PATH_LOCAL)) {
//       customCssContent = fs.readFileSync(CSS_PATH_LOCAL, 'utf8');
//       MEGA_TEST_SWG &&
//         isDevelopment &&
//         console.log('[Swagger] Кастомные стили загружены.');
//     } else {
//       console.warn('[Swagger] ф.theme.css не найден по пути:', CSS_PATH_LOCAL);
//     }
//   } catch (err) {
//     console.error('[Swagger] ошб.загр.stl.SWG :', (err as Error).message);
//     defaultSwaggerCss = '/* Базовые стили не загружены */';
//     customCssContent = '/* Кастомные стили не загружены */';
//   }
// };

// // fn подкл. SWG UI
// export const documentSwagger = (app: Application): void => {
//   // объедин.stl
//   const combinedCss = `
//     /* ===== Базовые стили Swagger UI ===== */
//     ${defaultSwaggerCss}

//     /* ===== Ваши кастомные стили ===== */
//     ${customCssContent}
//   `;

//   // конфиг.swg
//   const swaggerOptions = {
//     swaggerDefinition: {
//       openapi: '3.0.0',
//       info: {
//         title: 'PERN Stack API',
//         version: '2.2.1',
//         description: 'Описание методов интеграции API',
//       },
//       servers: [
//         {
//           url: isDevelopment
//             ? `${process.env.SRV_URL}/${process.env.SRV_NAME}`
//             : // `http://localhost:5000/${process.env.SRV_NAME}`,
//               `${process.env.SRV_URL}`,
//         },
//       ],
//     },
//     // абсол.путь ф.маршрута с коммент.JSON/JSDoc/OpenAPI. Пути настр.под src/, dist/ с использ. process.cwd() > надежности на Vercel
//     apis: [
//       // path.join(process.cwd(), 'src/routes/**/*.{js,ts}'), // DEV
//       // path.join(process.cwd(), 'routes/**/*.{js,ts}'), // PROD/Vercel (е/и без src/)
//       path.join(__dirname, '../../routes/**/*.{js,ts}'), // стар.подход
//     ],
//   };

//   // спецификация swg в JSON
//   const swaggerDocs = swaggerJSDoc(swaggerOptions) as any; /* | SwaggerSpec */

//   // import SWG_UI внутри fn от проблем.с import в верхн.уровне/Vercel
//   const swaggerUi = require('swagger-ui-express');

//   // проверка путей для отладки
//   if (MEGA_TEST_SWG && isDevelopment) {
//     console.log('[Swagger] аннотации в файлах:', swaggerOptions.apis);
//     swaggerOptions.apis.forEach((pattern) => {
//       const files = require('glob').sync(pattern);
//       console.log(`[Swagger] файлы по паттерну ${pattern}:`, files);
//     });
//   }
//   // логг.сгенерир.спеки
//   if (MEGA_TEST_SWG && isDevelopment) {
//     console.log(
//       '[Swagger] Сгенерированная спека:',
//       JSON.stringify(swaggerDocs, null, 2),
//     );
//   }
//   // проверка путей в спеке
//   if (!swaggerDocs.paths || Object.keys(swaggerDocs.paths).length === 0) {
//     console.warn(
//       '[Swagger] ВНИМАНИЕ: Сгенерированная спека не содержит путей (paths). Проверьте аннотации JSDoc в файлах маршрутов.',
//     );
//   }

//   // подкл./кастомизация SWG UI
//   app.use(
//     '/swagger',
//     // откл. serve передача масс.[] от обслуж.swagger-ui-express своих ф.
//     // swaggerUi.serve,
//     // использ. JS с CDN с null > локал.ф.
//     swaggerUi.serveFiles(null, { swaggerUrl: '/swagger' }), //
//     swaggerUi.setup(swaggerDocs, {
//       // назв.стр. Swagger
//       customSiteTitle: 'PERN API Docs (Swagger)',
//       swaggerOptions: {
//         // `постоянное разрешение` на использ.JWT Токен в swg
//         persistAuthorization: true,
//         // указ.URL > получ.спеки
//         // url: '/swagger',
//       },
//       // кастом.иконки в браузере
//       // customfavIcon: `/${process.env.PUB_DIR}/img/ico/icon.ico`,  // рекомендация
//       customfavIcon: `${process.env.SRV_URL}/${process.env.PUB_DIR}/swagger/icon.ico`,
//       // кастом ф.CSS
//       // customCss: `${process.env.SRV_URL}/swagger/theme.css`, // загр.ток.свои стили
//       // customCssUrl: `https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css`, // загр.ток.базовые стили
//       // customCssUrl: [
//       //   'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css', // для отраб.статич.ф.на PROD - Vercel
//       //   `${process.env.SRV_URL}/${process.env.PUB_DIR}/swagger/theme.css`,
//       // ],  // ! ошб. - базовые + своё в setup не раб.масс > css
//       // объедин.стили Базовый/Кастомный
//       customCss: combinedCss,
//       // кастом.ф.JS (для отраб.статич.ф.на PROD/Vercel)
//       customJs: [
//         'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.min.js',
//         'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.js',
//       ],
//       // откл.UI explorer от подкл.доп.ф.JS
//       explorer: false,
//     }),
//   );
// };

// ^ документация Swagger (swg)

import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Application } from 'express';
import path from 'path';
import fs from 'fs';

import { isDevelopment } from '../envs/env.consts';

// перем. > стилей Базовый/Кастомный в str
let defaultSwaggerCss: string = '';
let customCssContent: string = '';

// URL/путь загр.ф.стилей
const CSS_URL =
  'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css';
const CSS_PATH_LOCAL = path.join(
  __dirname,
  `../../../${process.env.PUB_DIR}/swagger/theme.css`,
  // `${process.env.SRV_URL}/${process.env.PUB_DIR}/swagger/theme.css`,
);
// const CSS_PATH_LOCAL = path.resolve(
//   process.cwd(),
//   `${process.env.PUB_DIR}/swagger/theme.css`,
// ); // ! не загр.в  vercel
console.log('[Swagger] process.cwd():', process.cwd());
console.log('[Swagger] __dirname:', __dirname);
console.log('[Swagger] Calculated CSS_PATH_LOCAL:', CSS_PATH_LOCAL);
console.log('[Swagger] File exists:', fs.existsSync(CSS_PATH_LOCAL));
const CSS_PATH_LOCAL_2 = path.resolve(
  process.cwd(),
  process.env.PUB_DIR!,
  'swagger',
  'theme.css',
);
console.log('CSS_PATH_LOCAL_2 : ', CSS_PATH_LOCAL_2);
const pubDir = process.env.PUB_DIR || 'public';
const CSS_PATH_LOCAL_3 = path.resolve(
  process.cwd(),
  pubDir,
  'swagger',
  'theme.css',
);
console.log('CSS_PATH_LOCAL_3 : ', CSS_PATH_LOCAL_3);
// подроб.логи >  тестирования
const MEGA_TEST_SWG = false;

/**
 * загр.стилей при старте до SWG UI
 */
// export const loadSwaggerStyles = async () => {
//   try {
//     // загруз.Базового CSS
//     const res = await fetch(CSS_URL);
//     if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
//     defaultSwaggerCss = await res.text();
//     MEGA_TEST_SWG &&
//       isDevelopment &&
//       console.log('[Swagger] Базовые стили загружены.');
//     // загруз.Кастомного CSS
//     if (fs.existsSync(CSS_PATH_LOCAL)) {
//       customCssContent = fs.readFileSync(CSS_PATH_LOCAL, 'utf8');
//       MEGA_TEST_SWG &&
//         isDevelopment &&
//         console.log('[Swagger] Кастомные стили загружены.');
//     } else {
//       console.warn(
//         '[Swagger] Кастомный ф.theme.css не найден по пути:',
//         CSS_PATH_LOCAL,
//       );
//     }
//   } catch (err) {
//     console.error('[Swagger] ошб.загр.stl.SWG :', (err as Error).message);
//     defaultSwaggerCss = '/* Базовые стили не загружены */';
//     customCssContent = '/* Кастомные стили не загружены */';
//   }
// };
export const loadSwaggerStyles = async () => {
  console.log('[Swagger] Начало загрузки стилей...');
  try {
    console.log('[Swagger] Загрузка базового CSS с', CSS_URL);
    const res = await fetch(CSS_URL);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    defaultSwaggerCss = await res.text();
    console.log(
      '[Swagger] Базовый CSS загружен, длина:',
      defaultSwaggerCss.length,
    );

    console.log('[Swagger] Путь к кастомному CSS:', CSS_PATH_LOCAL);
    if (fs.existsSync(CSS_PATH_LOCAL)) {
      console.log('[Swagger] Чтение кастомного CSS...');
      customCssContent = fs.readFileSync(CSS_PATH_LOCAL, 'utf8');
      console.log(
        '[Swagger] Кастомный CSS загружен, длина:',
        customCssContent.length,
      );
    } else {
      console.warn('[Swagger] Кастомный файл theme.css не найден.');
    }
    console.log('[Swagger] Объединение стилей завершено.');
  } catch (err) {
    console.error(
      '[Swagger] Критическая ошибка загрузки стилей:',
      (err as Error).message,
    );
    defaultSwaggerCss = '/* Fallback: Базовые стили не загружены */';
    customCssContent = '/* Fallback: Кастомные стили не загружены */';
  }
};

// fn подкл. SWG UI
export const documentSwagger = (app: Application): void => {
  // объедин.stl
  const combinedCss = `
    /* ===== Базовые стили Swagger UI ===== */
    ${defaultSwaggerCss}

    /* ===== Ваши кастомные стили ===== */
    ${customCssContent}
  `;

  // конфиг.swg
  const swaggerOptions = {
    swaggerDefinition: {
      openapi: '3.0.0',
      info: {
        title: 'PERN Stack API',
        version: '2.2.1',
        description: 'Описание методов интеграции API',
      },
      // URL > req
      servers: [
        {
          url: isDevelopment
            ? `${process.env.SRV_URL}/${process.env.SRV_NAME}`
            : `${process.env.SRV_URL}`,
          description: isDevelopment ? 'Development server' : '',
          //
          //   isDevelopment
          //   ? `${process.env.SRV_URL}/${process.env.SRV_NAME}`
          //   : `http://localhost:5000/${process.env.SRV_NAME}`,
          // // `${process.env.SRV_URL}`,
        },
      ],
    },
    // абсол.путь ф.маршрута с коммент.JSON/JSDoc/OpenAPI. Пути настр.под src/, dist/ с использ. process.cwd() > надежности на Vercel
    apis: [
      path.join(__dirname, '../../routes/**/*.{js,ts}'), // стар.подходА
      // path.join(process.cwd(), 'src/routes/**/*.{js,ts}'), // DEV
      // path.join(process.cwd(), 'routes/**/*.{js,ts}'), // PROD/Vercel (е/и без src/)
    ],
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
      // customfavIcon: `/${process.env.PUB_DIR}/swagger/icon.ico`, //  ^ вроде все раб - проверил
      customfavIcon: `../../../${process.env.PUB_DIR}/swagger/icon.ico`, //  ^ вроде все раб
      // customfavIcon: `${process.env.SRV_URL}/${process.env.PUB_DIR}/swagger/icon.ico`, //  ^ вроде все раб
      // кастом ф.CSS
      // customCss: `${process.env.SRV_URL}/swagger/theme.css`, // загр.ток.свои стили
      // customCssUrl: `https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css`, // загр.ток.базовые стили
      // customCssUrl: [
      //   'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css', // для отраб.статич.ф.на PROD - Vercel
      //   `${process.env.SRV_URL}/${process.env.PUB_DIR}/swagger/theme.css`,
      // ],  // ! ошб. - базовые + своё в setup не раб.масс > css
      // объедин.стили Базовый/Кастомный
      customCss: combinedCss,
      // кастом ф.JS (для отраб.статич.ф.на PROD - Vercel)
      customJs: [
        'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.js',
      ],
    }),
  );
};
