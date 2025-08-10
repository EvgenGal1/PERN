// ^ загр.скрипт по табл.из ф.SQL (альтер.ручн.pgAdmin)
// кмд.запуска >  TS/JS (cd server) - npx cross-env NODE_ENV=development npx ts-node src/db/scripts/seedDatabase.ts  ||  node src/db/scripts/seedDatabase.js  ||  npm run db:seed (все файлы)  ||  npm run db:seed:commands (ф.команд)

import * as fs from 'fs';
import * as path from 'path';

import sequelize from '../../config/sequelize';
import { logDatabaseError } from '../utils/errorLogger';

/**
 * Fn посева данн.в табл.из ф.SQL
 * @param closeConnectionAfter Закрыть соед.с БД после выполнения. По умолчанию false. Авто.устан. true при прямом вызове
 * @returns Promise<void>
 */
async function seedDatabase(
  closeConnectionAfter: boolean = false,
): Promise<void> {
  // назв.таблицы > req.SQL к БД
  const targetTable = 'secret_commands';
  try {
    const seedFilePath = path.join(
      __dirname,
      `../seeds/${targetTable}_test_connection.sql`, // тест подключения
      // `../seeds/${targetTable}_seeds.sql`, // загр.данн.
    );

    if (!fs.existsSync(seedFilePath)) {
      throw new Error(`ф.Посева не найден: ${seedFilePath}`);
    }

    const seedSQL = fs.readFileSync(seedFilePath, 'utf8');
    console.log(`Выполнение SQL скрипта > заполнения табл.'${targetTable}'`);
    await sequelize.query(seedSQL);
    console.log(`табл.'${targetTable}' Наполнена или данн.существовали`);
  } catch (error: unknown) {
    console.error('! ОШИБКА ПРИ ПОСЕВЕ ДАННЫХ - ', (error as Error).message);
    throw error;
  } finally {
    if (closeConnectionAfter) {
      console.log('Закрыть Соединения с БД по запросу...');
      await sequelize.close();
      console.log('Соединение с БД Закрыто.');
    }
  }
}

// универс.запуск скрипта при прямом вызове с гаринтией закрытия
if (require.main === module) {
  console.log('Скрипт seedDatabase Запущен напрямую.');
  seedDatabase(true)
    .then(() => {
      console.log('Скрипт Завершён Успешно.');
      process.exit(0);
    })
    .catch(async (error) => {
      logDatabaseError('КРИТИЧЕСКАЯ ОШИБКА В СКРИПТЕ', error);
      // е/и ошб.до finally
      try {
        await sequelize.close();
        console.error('Соединение с БД Закрыто из-за ошибки.');
      } catch (closeError: unknown) {
        logDatabaseError('ОШИБКА ПРИ ЗАКРЫТИИ СОЕДИНЕНИЯ', closeError);
      }
      process.exit(1);
    });
}

export default seedDatabase;
