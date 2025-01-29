import ProductModel from '../models/ProductModel';
import ProductPropModel from '../models/ProductPropModel';
import BrandModel from '../models/BrandModel';
import CategoryModel from '../models/CategoryModel';
// import RatingModel from '../models/RatingModel';
import FileService from './file.service';
import {
  ProductAttributes,
  ProductCreateDTO,
  ProductOptions,
  ProductUpdateDTO,
} from '../types/product_prop.interface';
import ApiError from '../middleware/errors/ApiError';
class ProductService {
  async getAllProducts(
    options: ProductOptions,
  ): Promise<{ count: number; rows: ProductModel[]; limit: number }> {
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
    // кол-во эл. `Найдите и посчитайте все`
    const countAll = await ProductModel.findAndCountAll({
      where,
      // для каждого Продукта получаем Бренд и Категорию
      include: [
        { model: BrandModel, as: 'brand' },
        { model: CategoryModel, as: 'category' },
      ],
    });

    // Пропуск `n`(limit) первых эл.в БД е/и page > 1 (с защитой от минус.результата)
    const offset = Math.max(
      0,
      (page - 1) * limit > countAll.count
        ? // е/и эл.в БД МЕНЬШЕ чем в запросе(offset)
          countAll.count - limit
        : (page - 1) * limit,
    );

    // ^ сорт.по голосу (врем.откл.)
    // const order = sortField === 'votes' ? [[ {  model: RatingModel, as: 'ratings',getAttributes: ['rate', 'productId', 'userId'], }, 'rates', sortOrd || 'ASC', ], ]   :   [[sortField || 'name', sortOrd || 'ASC']];

    const products = await ProductModel.findAndCountAll({
      where,
      limit,
      offset,
      attributes: ['id', 'name', 'price', 'rating', 'image'],
      include: [
        // получ.все модели со связ.таблц.
        // { all: true, nested: true },
        // получ.у Продукта Бренд/Категорию
        { model: BrandModel, as: 'brand', attributes: ['name'] },
        { model: CategoryModel, as: 'category', attributes: ['name'] },
        // sortField === 'votes' ? { model: RatingModel, as: 'ratings', attributes: ['rates'] } : {}, // ^ сорт.по голосу (врем.откл.)
      ],
      order: [[sortField || 'name', sortOrd || 'ASC']],
      // order as RatingModel | ProductModel | any // ^ сорт.по голосу (врем.откл.)
    });
    return { count: products.count, rows: products.rows, limit };
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
