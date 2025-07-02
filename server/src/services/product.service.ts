import { Op, Sequelize } from 'sequelize';
import { Multer } from 'multer';

import ProductModel from '../models/ProductModel';
import ProductPropModel from '../models/ProductPropModel';
import BrandModel from '../models/BrandModel';
import CategoryModel from '../models/CategoryModel';
import FileService from './file.service';
import {
  ProductCreateDTO,
  ProductData,
  ProductOptions,
  ProductUpdateDTO,
} from '../types/product_prop.interface';
import { RatingData } from '../types/catalog.interface';
import ApiError from '../middleware/errors/ApiError';

class ProductService {
  async getOneProduct(id: number): Promise<ProductData> {
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
    if (!product) throw ApiError.notFound(`Продукт с ID '${id}' не найден`);
    return product as ProductData;
  }

  async getAllProducts(options: ProductOptions): Promise<{
    rows: ProductData[];
    pagination?: { count: number; limit: number; page: number };
  }> {
    const {
      categoryId,
      brandId,
      limit = 20,
      page = 1,
      order = 'ASC',
      field = 'name',
    } = options;

    // валидация параметров с защитой от отрацательных и больших чисел
    const pageNumber = Math.max(1, Number(page) || 1);
    const limitNumber = Math.min(Math.max(1, Number(limit) || 20), 100);

    // объ.для уточнения запроса к др.Табл.
    const where: any = {};

    // Фильтр по ID Категорий/Брендов
    if (categoryId)
      // массив значений для IN-запроса с преобраз.в число или число
      where.categoryId = categoryId.includes('_')
        ? { [Op.in]: categoryId.split('_').map(Number) }
        : Number(categoryId);
    if (brandId)
      where.brandId = brandId.includes('_')
        ? { [Op.in]: brandId.split('_').map(Number) }
        : Number(brandId);

    // ^ сорт.по голосу (врем.откл.)
    // const order = field === 'votes' ? [[ {  model: RatingModel, as: 'ratings',getAttributes: ['rate', 'productId', 'userId'], }, 'rates', order || 'ASC', ], ]   :   [[field || 'name', order || 'ASC']];

    const products = await ProductModel.findAndCountAll({
      where,
      limit: limitNumber,
      offset: (pageNumber - 1) * limitNumber,
      attributes: [
        // явно указ./переимен. alias/псевдоним id из ProductModel в productId
        ['id', 'productId'],
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
        {
          model: BrandModel,
          as: 'brand',
          attributes: ['name'],
          required: false,
        },
        {
          model: CategoryModel,
          as: 'category',
          attributes: ['name'],
          required: false,
        },
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
      order: [[field || 'name', order || 'ASC']],
      // order as RatingModel | ProductModel | any // ^ сорт.по голосу (врем.откл.)
    });

    // преобраз.результ.в нужный формат
    const rowsWithRatings: ProductData[] = products.rows.map(
      (product): ProductData => ({
        // унар.преобраз.в num с защит.отсутствия TS
        id: Number(product.get('productId')),
        name: product.name,
        price: product.price,
        image: product.image,
        brand: product.brand ? { name: product.brand.name } : null,
        category: product.category ? { name: product.category.name } : null,
        ratings: {
          // измен.формат со знач.по умолчанию
          rates: Number(product.get('rates')) || 0,
          votes: parseInt(product.get('votes')?.toString() ?? '0', 10),
          rating: +product.rating! || 0,
        } as RatingData,
      }),
    );

    return {
      rows: rowsWithRatings,
      pagination: {
        // Кол-во Продуктов с учётом масс.GROUP BY по длине
        count: Array.isArray(products.count)
          ? products.count.length
          : products.count,
        limit: limitNumber,
        page: pageNumber,
      },
    };
  }

  async createProduct(
    data: ProductCreateDTO,
    img?: Express.Multer.File,
  ): Promise<ProductData> {
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
    })) as ProductData;
  }

  async updateProduct(
    id: number,
    data: ProductUpdateDTO,
    img?: Express.Multer.File,
  ): Promise<ProductData> {
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
    return product as ProductData;
  }

  async deleteProduct(id: number): Promise<ProductData> {
    const product = await ProductModel.findByPk(id);
    if (!product) throw ApiError.notFound('Продукт не найден');
    // удал.изо.Продукта
    if (product.image) FileService.deleteFile(product.image);
    // удал.св-ва Продукта
    await ProductPropModel.destroy({ where: { productId: id } });
    await product.destroy();
    return product as ProductData;
  }
}

export default new ProductService();
