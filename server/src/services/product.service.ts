import { Sequelize } from 'sequelize';

import ProductModel from '../models/ProductModel';
import ProductPropModel from '../models/ProductPropModel';
import BrandModel from '../models/BrandModel';
import CategoryModel from '../models/CategoryModel';
import FileService from './file.service';
import {
  ProductAttributes,
  ProductCreateDTO,
  ProductData,
  ProductOptions,
  ProductUpdateDTO,
} from '../types/product_prop.interface';
import { RatingData } from '../types/catalog.interface';
import ApiError from '../middleware/errors/ApiError';

class ProductService {
  async getAllProducts(
    options: ProductOptions,
  ): Promise<{ count: number; rows: ProductData[]; limit: number }> {
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

    // Категории/Бренд
    if (categoryId)
      where.categoryId = categoryId.includes('_')
        ? categoryId.split('_')
        : categoryId;
    if (brandId)
      where.brandId = brandId.includes('_') ? brandId.split('_') : brandId;

    // кол-во эл.
    const totalCount = await ProductModel.count({ where });

    // Пропуск `n`(limit) первых эл.в БД е/и page > 1 (с защитой от минус.результата)
    const offset = Math.max(
      0,
      (page - 1) * limit > totalCount
        ? // е/и эл.в БД МЕНЬШЕ чем в запросе(offset)
          totalCount - limit
        : (page - 1) * limit,
    );

    // ^ сорт.по голосу (врем.откл.)
    // const order = sortField === 'votes' ? [[ {  model: RatingModel, as: 'ratings',getAttributes: ['rate', 'productId', 'userId'], }, 'rates', sortOrd || 'ASC', ], ]   :   [[sortField || 'name', sortOrd || 'ASC']];

    const products = await ProductModel.findAndCountAll({
      where,
      limit,
      offset,
      attributes: [
        // псевдоним для id из ProductModel
        ['id', 'productId'], // Явно указываем alias для id из ProductModel
        'name',
        'price',
        'image',
        // подзапросы для оценок
        [
          Sequelize.literal(
            '(SELECT COALESCE(SUM("rate"), 0) FROM "ratings" WHERE "ratings"."product_id" = "ProductModel"."id")',
          ),
          'rates', // ставки
        ],
        [
          Sequelize.literal(
            '(SELECT COALESCE(COUNT("rate"), 0) FROM "ratings" WHERE "ratings"."product_id" = "ProductModel"."id")',
          ),
          'votes', //голоса
        ],
        [
          Sequelize.literal(
            '(SELECT COALESCE(CAST(SUM("rate") AS FLOAT) / NULLIF(COUNT("rate"), 0), 0) FROM "ratings" WHERE "ratings"."product_id" = "ProductModel"."id")',
          ),
          'rating', //рейтинг
        ],
      ],
      include: [
        { model: BrandModel, as: 'brand', attributes: ['name'] },
        { model: CategoryModel, as: 'category', attributes: ['name'] },
      ],
      // групп.по полям использ.в SELECT > раб.агрегирующих fn
      group: [
        'ProductModel.id',
        'brand.id',
        'category.id',
        'ProductModel.name',
        'ProductModel.price',
        'ProductModel.image',
      ],
      order: [[sortField || 'name', sortOrd || 'ASC']],
      // order as RatingModel | ProductModel | any // ^ сорт.по голосу (врем.откл.)
    });

    // Преобразуем результаты в нужный формат
    const rowsWithRatings: ProductData[] = products.rows.map(
      (product): ProductData => {
        // получ.плоск.объ.данн.без доп.мтд.Sequelize
        const productData = product.get({ plain: true });
        return {
          // унар.преобраз.в num с защит.отсутствия TS
          id: +product.get('productId')!,
          name: productData.name,
          price: productData.price,
          image: productData.image,
          brand: productData.brand ? { name: productData.brand.name } : null,
          category: productData.category
            ? { name: productData.category.name }
            : null,
          ratings: {
            // измен.формат со знач.по умолчанию
            rates: parseInt(product.get('rates')?.toString() ?? '0', 10),
            votes: parseInt(product.get('votes')?.toString() ?? '0', 10),
            rating: +product.rating! || 0,
          } as RatingData,
        };
      },
    );

    return { count: totalCount, rows: rowsWithRatings, limit };
  }

  async getOneProduct(id: number): Promise<ProductAttributes> {
    const product = await ProductModel.findByPk(id, {
      // указ.нужные поля
      attributes: ['id', 'name', 'price', 'rating', 'image'],
      include: [
        { model: ProductPropModel, as: 'props', attributes: ['name', 'value'] },
        // получать категорию и бренд
        { model: BrandModel, as: 'brand', attributes: ['name'] },
        { model: CategoryModel, as: 'category', attributes: ['name'] },
        // { model: RatingModel, as: "ratings" },
      ],
    });
    if (!product) throw ApiError.notFound('Продукт не найден');
    return product;
  }

  async createProduct(
    data: ProductCreateDTO,
    img?: Express.Multer.File,
  ): Promise<ProductAttributes> {
    // сохр.изо.с указ.'' от null
    const image = img ? FileService.saveFile(img) : null;
    const { name, price, categoryId = null, brandId = null, props } = data;

    // созд.1го Продукта
    const product = await ProductModel.create({
      name,
      price,
      image,
      categoryId,
      brandId,
    });
    // созд.свойства 1го Продукта
    if (props) {
      const propsParse = JSON.parse(props);
      // перебор масс. по перв.эл.масс.
      for (const prop of propsParse[0]) {
        // данн.из кажд.эл.сохр.по отдельности
        await ProductPropModel.create({
          name: prop.name,
          value: prop.value,
          productId: product.id,
        });
      }
    }

    // возврат Продукта со свойствами
    return (await ProductModel.findByPk(product.id, {
      include: [{ model: ProductPropModel, as: 'props' }],
    })) as ProductAttributes;
  }

  async updateProduct(
    id: number,
    data: ProductUpdateDTO,
    img?: Express.Multer.File,
  ): Promise<ProductAttributes> {
    const product = await ProductModel.findByPk(id, {
      include: [{ model: ProductPropModel, as: 'props' }],
    });
    if (!product) throw ApiError.notFound('Продукт не найден');
    // е/и загр.нов.изо
    if (img) {
      // сохр.нов.изо./удал.стар.
      data.image = FileService.saveFile(img);
      if (product.image) FileService.deleteFile(product.image);
    }
    // обнов.в БД
    await product.update(data as ProductModel);

    // свойства Продукта
    if (data.props) {
      // удал.стар./созд.нов.
      await ProductPropModel.destroy({ where: { productId: id } });
      const props = JSON.parse(data.props);
      for (const prop of props) {
        await ProductPropModel.create({
          name: prop.name,
          value: prop.value,
          productId: product.id,
        });
      }
    }

    // обнов.объ.Продукта, возврат нов.данн.
    await product.reload();
    return product;
  }

  async deleteProduct(id: number): Promise<ProductAttributes> {
    const product = await ProductModel.findByPk(id);
    if (!product) throw ApiError.notFound('Продукт не найден');
    // удал.изо.Продукта
    if (product.image) FileService.deleteFile(product.image);
    // удал.св-ва Продукта
    await ProductPropModel.destroy({ where: { productId: id } });
    await product.destroy();
    return product;
  }
}

export default new ProductService();
