import {
  Product as ProductMapping,
  ProductProp as ProductPropMapping,
  Brand as BrandMapping,
  Category as CategoryMapping,
} from "../models/mapping.js";
import AppError from "../error/AppError_Tok.js";
import FileService from "../services/File.js";

class Product {
  // async getAll(params) {
  async getAll(options) {
    // const { categoryId, brandId } = params;
    const { categoryId, brandId, limit, page } = options;
    const offset = (page - 1) * limit;
    const where = {};
    if (categoryId) where.categoryId = categoryId;
    if (brandId) where.brandId = brandId;
    // const products = await ProductMapping.findAll({ where });
    const products = await ProductMapping.findAndCountAll({
      where,
      limit,
      offset,
      // для каждого товара получаем бренд и категорию
      include: [
        { model: BrandMapping, as: "brand" },
        { model: CategoryMapping, as: "category" },
      ],
      order: [["name", "ASC"]],
    });
    return products;
  }

  async getOne(id) {
    // const product = await ProductMapping.findByPk(id);
    // const product = await ProductMapping.findOne({
    //   where: { id: id },
    const product = await ProductMapping.findByPk(id, {
      include: [
        { model: ProductPropMapping, as: "props" },
        // получать категорию и бренд
        { model: BrandMapping, as: "brand" },
        { model: CategoryMapping, as: "category" },
      ],
    });
    if (!product) {
      throw new Error("Товар не найден в БД");
    }
    return product;
  }

  async create(data, img) {
    // поскольку image не допускает null, задаем пустую строку
    const image = FileService.save(img) ?? "";
    const { name, price, categoryId = null, brandId = null } = data;
    const product = await ProductMapping.create({
      name,
      price,
      image,
      categoryId,
      brandId,
    });
    // свойства товара
    if (data.props) {
      // ! ошб. Unexpected token o in JSON at position 1 - коммит parse от не нужного преобразованя JSON в объ.
      const props = /* JSON.parse( */ data.props; /* ) */
      for (let prop of props) {
        await ProductPropMapping.create({
          name: prop.name,
          value: prop.value,
          productId: product.id,
        });
      }
    }
    // возвращать будем товар со свойствами
    const created = await ProductMapping.findByPk(product.id, {
      include: [{ model: ProductPropMapping, as: "props" }],
    });
    return created;
  }

  async update(id, data, img) {
    const product = await ProductMapping.findByPk(id, {
      include: [{ model: ProductPropMapping, as: "props" }],
    });
    if (!product) {
      throw new Error("Товар не найден в БД");
    }
    // пробуем сохранить изображение, если оно было загружено
    const file = FileService.save(img);
    // если загружено новое изображение — надо удалить старое
    if (file && product.image) {
      FileService.delete(product.image);
    }
    // подготавливаем данные, которые надо обновить в базе данных
    const {
      name = product.name,
      price = product.price,
      categoryId = product.categoryId,
      brandId = product.brandId,
      image = file ? file : product.image,
    } = data;
    await product.update({ name, price, image, categoryId, brandId });
    if (data.props) {
      // свойства товара
      // удаляем старые и добавляем новые
      await ProductPropMapping.destroy({ where: { productId: id } });
      const props = JSON.parse(data.props);
      for (let prop of props) {
        await ProductPropMapping.create({
          name: prop.name,
          value: prop.value,
          productId: product.id,
        });
      }
    }
    // обновим объект товара, чтобы вернуть свежие данные
    await product.reload();
    return product;
  }

  async delete(id) {
    const product = await ProductMapping.findByPk(id);
    if (!product) {
      throw new Error("Товар не найден в БД");
    }
    if (product.image) {
      // удаляем изображение товара
      FileService.delete(product.image);
    }
    await product.destroy();
    return product;
  }

  // TODO: это вообще используется?
  async isExist(id) {
    const basket = await ProductMapping.findByPk(id);
    return basket;
  }
}

export default new Product();
