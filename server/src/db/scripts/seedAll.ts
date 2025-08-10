// ^ универс.скрипт загр.данн.в БД

import sequelize from '../../config/sequelize';
import seedDatabase from './seedDatabase';

async function seedAll() {
  try {
    console.log('Начало процесса посева данных...');

    // посеять команды/категории/...
    await seedDatabase();
    // await seedCategories();

    console.log('Все данные успешно посеяны!');
  } catch (error) {
    console.error('Ошибка при посеве данных:', error);
  } finally {
    // закрыть соед.с БД
    await sequelize.close();
    console.log('Соединение с БД закрыто.');
  }
}

// запуск скрипта при прямом вызове
if (require.main === module) seedAll();

export default seedAll;
