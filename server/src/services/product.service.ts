import ProductModel from '../models/ProductModel';
import ProductPropModel from '../models/ProductPropModel';
import BrandModel from '../models/BrandModel';
import CategoryModel from '../models/CategoryModel';
import FileService from './file.service';
import ApiError from '../middleware/errors/ApiError';

// Типы данных

interface CreateData {
  name: string | any;
  price: number | any;
  categoryId?: number | null | any;
  brandId?: number | null | any;
  props?: string | any;
}

interface UpdateData {
  name?: string;
  price?: number;
  rating?: number;
  categoryId?: number;
  brandId?: number;
  image?: string;
  props?: string;
}

class ProductService {
  async getAllProduct(options: any) {
    try {
      const {
        categoryId,
        brandId,
        limit = 20,
        page = 1,
        sortOrd = 'ASC',
        sortField = 'name',
      } = options;

      // перем.для уточнения запроса к др.Табл.
      let where: any = {};

      // ^ определение/запись кол-ва значений ч/з разделитель(_) (if - мн. if else - одно)
      // Категории
      if (categoryId?.includes('_')) where.categoryId = categoryId.split('_');
      else if (categoryId && !categoryId?.includes('_'))
        where.categoryId = categoryId;
      // Бренд
      if (brandId?.includes('_')) where.brandId = brandId.split('_');
      else if (brandId && !brandId?.includes('_')) where.brandId = brandId;

      // Кол-во эл. `Найдите и посчитайте все`
      let countAll = await ProductModel.findAndCountAll({
        where,
        // для каждого товара получаем Бренд и Категорию
        include: [
          { model: BrandModel, as: 'brand' },
          { model: CategoryModel, as: 'category' },
        ],
      });

      // ! дораб - для сорт.по голосу(из Табл.Rating)
      let sortFieldVotes: any = {};
      // console.log("sortFieldVotes 0 : " + sortFieldVotes);
      // console.log(sortFieldVotes);
      if (sortField === 'votes') {
        sortFieldVotes = `{ model: RatingModel, as: "ratings" }`;
        // console.log("sortFieldVotes : " + sortFieldVotes);
        // console.log(sortFieldVotes);
      }
      let sortFieldParam = sortField;
      if (sortField === 'votes') {
        // ! не раб.сортировка по votes, userId, rate|s, rating|s
        // sortFieldParam = `RatingModel, "votes"`;
        sortFieldParam = `{ model: RatingModel, as: "ratings" }, "rates"`;
      }

      // Пропускаем n первых эл.в БД (для 1 стр.)
      let offset = 0;
      // Пропуск n(limit) эл.в БД е/и page > 1
      if (page > 1) {
        offset = (page - 1) * limit;
      }
      // е/и эл.в БД МЕНЬШЕ чем в запросе(offset)
      if (countAll.count <= offset) offset = countAll.count - limit;
      // защита от минусового результата
      if (offset < 0) offset = 0;

      const products = await ProductModel.findAndCountAll({
        where,
        limit,
        offset,
        // для каждого товара получаем бренд и категорию
        include: [
          // получаем все модели, вместе со связанными с ними моделями
          // { all: true, nested: true },
          { model: BrandModel, as: 'brand' },
          { model: CategoryModel, as: 'category' },
          // { model: ProductPropModel, as: "props" },
          // sortFieldVotes
          // { model: RatingModel, as: "ratings" },
        ],
        order: [[sortFieldParam || 'name', sortOrd || 'ASC']],
      });

      return { ...products, limit };
    } catch (error: unknown) {
      throw ApiError.badRequest(
        `Товары не найдены в БД`,
        error instanceof Error ? error.message : 'Неизвестная ошибка',
      );
    }
  }

  async getOneProduct(id: number) {
    try {
      const product = await ProductModel.findByPk(id, {
        include: [
          { model: ProductPropModel, as: 'props' },
          // получать категорию и бренд
          { model: BrandModel, as: 'brand' },
          { model: CategoryModel, as: 'category' },
          // { model: RatingModel, as: "ratings" },
        ],
      });
      if (!product) {
        throw new Error('Товар не найден в БД');
      }
      return product;
    } catch (error: unknown) {
      throw ApiError.badRequest(
        `Товар не найден в БД`,
        error instanceof Error ? error.message : 'Неизвестная ошибка',
      );
    }
  }

  async createProduct(
    data: CreateData,
    img: any /* : Express.Multer.File */,
  ): Promise</* Products | */ any> {
    try {
      // сохр.изо.с указ.'' от null
      const image = FileService.saveFile(img) ?? '';
      const { name, price, categoryId = null, brandId = null } = data;

      // перем.для уточнения записи запроса к др.Табл.
      // let where: any = {};
      // перем.для вызова метода возврата Товара с Неск-им/Одним знач.
      let returned: any = {};

      // ^ для записи 1го знач.
      if ((categoryId.length || brandId.length) < 2) {
        // созд.1го Товара
        const product = await ProductModel.create({
          name,
          price,
          image,
          // categoryId,
          // brandId,
        });
        // созд.свойства 1го Товара
        if (data.props) {
          const propsParse = JSON.parse(data.props);
          // получ.всегда первого массива
          let props = propsParse[0];
          // перебор масс. по эл.
          for (let prop of props) {
            // данн.из кажд.эл.сохр.по отдельности
            await ProductPropModel.create({
              name: prop.name,
              value: prop.value,
              productId: product.get('id') as number,
              // productId: product.id,
            });
          }
        }

        // возврат 1го Товар со свойствами
        returned = await ProductModel.findByPk(product.getDataValue('id'), {
          include: [{ model: ProductPropModel, as: 'props' }],
        });
      }

      // ^ для запись Неск-им знач.
      if (categoryId?.length > 1 || brandId?.length > 1) {
        // перем.всех разбитых парам.
        const resultAll: {
          name: any;
          price: any;
          brandId: any;
          categoryId: any;
          image: string;
        }[] = [];

        // ^ для render|state|загрузки на ОБЪЕКТЕ
        // // разбивка вход стр./объ. на масс. по запятой
        // let nameAll = name.split(",");
        // let priceAll = price.split(",");
        // let brandIdAll = brandId.split(",");
        // let categoryIdAll = categoryId.split(",");

        // для image отдельный split т.к. FileService возвращ.стр.имена ч/з запятую
        let imageAll = image.split(',');

        // цикл по длине какого-либо парам.
        // ^ для render|state|загрузки на ОБЪЕКТЕ
        // for (var i = 0; i < nameAll.length; i++) {
        // ^ для render|state|загрузки на МАССИВЕ
        for (var i = 0; i < name.length; i++) {
          // один Товар в переборе
          const allParam = {
            // ^ для render|state|загрузки на ОБЪЕКТЕ
            // name: nameAll[i],
            // price: priceAll[i],
            // brandId: brandIdAll[i],
            // categoryId: categoryIdAll[i],
            // image: imageAll[i] || "",

            // ^ для render|state|загрузки на МАССИВЕ
            name: name[i],
            price: price[i],
            brandId: brandId[i],
            categoryId: categoryId[i],
            image: imageAll[i] || '',
          };

          // запись одного Товара в общ.перем.
          resultAll.push(allParam);
        }

        // массовое созд.
        const productBulk = await ProductModel.bulkCreate(resultAll);

        // е/и есть Хар-ки Товара
        if (data.props) {
          // преобразуем вход.строку в объ/масс. с масс.объ.
          const propsParse: any = JSON.parse(data.props);
          // [
          //   0: [ { name: '1212', value: 'qw' }, { name: '121212', value: 'qwqw' } ],
          //   1: [ { name: '9898', value: 'as' } ]
          // ]

          // перебор всех key в Хар-ах
          for (const keys of Object.keys(propsParse)) {
            const key: any = keys;
            // Object.keys(propsParse) - ['0', '1'] | key - 0 затем 1

            // получ.позиц.id нов.Товаров по key имеющихся Хар-ик (каждому Товару свои Хар-ки)
            const productBulkId: any /* number */ /* | undefined */ =
              productBulk[key].getDataValue('id');
            // 304 затем 305

            // перем. масс.значений определённого key
            const value = propsParse[key];
            // [ { name: '1212', value: 'qw' }, { name: '121212', value: 'qwqw' } ]

            // перебор объ.в опред.масс.значений
            for (let prop of value) {
              // prop - { name: '1212', value: 'qw' } затем { name: '121212', value: 'qwqw' }
              // запись данн.каждого объ.по отдельности
              await ProductPropModel.create({
                name: prop.name,
                value: prop.value,
                productId: productBulkId,
              });
            }
          }
        }

        // возврат неск. Товаров со свойствами и кол-ом
        returned = await ProductModel.findAndCountAll({
          // where, // ? не нужно
          include: [{ model: ProductPropModel, as: 'props' }],
        });
      }

      // возвращ.результ.созд.
      return returned;
    } catch (error: unknown) {
      throw ApiError.badRequest(
        `Товар не создан в БД`,
        error instanceof Error ? error.message : 'Неизвестная ошибка',
      );
    }
  }

  async updateProduct(
    id: number | string,
    data: UpdateData,
    img: any /* : Express.Multer.File */,
  ) {
    try {
      // const order = (await OrderModel.findByPk(id, {
      //   include: [{ model: OrderItemModel, as: 'items' }],
      // })) /* as unknown as OrderAttributes */ as Model<OrderAttributes> & {
      //   items: OrderItemAttributes[];
      // };

      const product = /* ( */ await ProductModel.findByPk(id, {
        include: [{ model: ProductPropModel, as: 'props' }],
      }); /* ) as Model<ProductAttributes> & { items: ProductPropAttributes[]; } */
      if (!product) {
        throw new Error('Товар не найден в БД');
      }
      // сохр.изо. е/и загружено
      const file = FileService.saveFile(img);
      // если загружено новое изображение — надо удалить старое
      if (file && product.get('image')) {
        FileService.deleteFile(product.get('image') as string);
        // FileService.deleteFile(product.image);
      }
      // подготовка вход.данн. для обнов. в БД
      const {
        name = product.get('name') as string,
        price = product.get('price') as number,
        rating = product.get('rating') as number,
        categoryId = product.get('categoryId') as number,
        brandId = product.get('brandId') as number,
        image = (file ? file : product.get('image')) as string,
      } = data;

      await product.update({ name, price, rating, image, categoryId, brandId });

      // свойства товара
      if (data.props) {
        // удаляем старые и добавляем новые
        await ProductPropModel.destroy({ where: { productId: id } });
        const props = JSON.parse(data.props);
        for (let prop of props) {
          await ProductPropModel.create({
            name: prop.name,
            value: prop.value,
            productId: product.get('id') as number,
          });
        }
      }

      // обновим объект товара, чтобы вернуть свежие данные
      await product.reload();
      return product;
    } catch (error: unknown) {
      throw ApiError.badRequest(
        `Товар не обновлён`,
        error instanceof Error ? error.message : 'Неизвестная ошибка',
      );
    }
  }

  async deleteProduct(id: number | string) {
    try {
      const product = await ProductModel.findByPk(id);
      if (!product) {
        throw new Error('Товар не найден в БД');
      }
      // удаляем ИЗО Товара
      const imagePath = product.get('image') as string;
      if (imagePath) {
        FileService.deleteFile(imagePath);
      }

      // удаляем Хар-ки Товара
      if (product.get('prop')) {
        //   ProductPropModel.destroy({ where: { productId: id } });
        // const propsExist = await ProductPropModel.count({
        //   where: { productId: id },
        // });
        // if (propsExist) {
        //   await ProductPropModel.destroy({ where: { productId: id } });
        // }
        await ProductPropModel.destroy({ where: { productId: id } });
      }

      await product.destroy();
      return product;
    } catch (error: unknown) {
      throw ApiError.badRequest(
        `Товар не удалён`,
        error instanceof Error ? error.message : 'Неизвестная ошибка',
      );
    }
  }

  // TODO: это вообще используется?
  async isExistProduct(id: number) {
    const basket = await ProductModel.findByPk(id);
    return basket;
  }
}

export default new ProductService();
