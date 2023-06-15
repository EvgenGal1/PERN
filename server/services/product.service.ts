import AppError from "../error/ApiError";
import {
  Product as ProductMapping,
  ProductProp as ProductPropMapping,
  Brand as BrandMapping,
  Category as CategoryMapping,
} from "../models/mapping";
import FileService from "./file.service";

// Типы данных
interface Products {
  id: number;
  name: string;
  price: number;
  image: string;
  categoryId: number | null;
  brandId: number | null;
  props?: ProductProp[];
  category?: Category;
  brand?: Brand;
  // createdAt: Date;
  // updatedAt: Date;
}

interface CreateData {
  name: string;
  price: number;
  categoryId?: number | null;
  brandId?: number | null;
  props?: string;
}

interface UpdateData {
  name?: string;
  price?: number;
  categoryId?: number;
  brandId?: number;
  image?: string;
  props?: string;
}

interface ProductProp {
  id: number;
  name: string;
  value: string;
  productId: number;
  // createdAt: Date;
  // updatedAt: Date;
}

interface Category {
  id: number;
  name: string;
  // createdAt: Date;
  // updatedAt: Date;
}

interface Brand {
  id: number;
  name: string;
  // createdAt: Date;
  // updatedAt: Date;
}

class Product {
  // async getAll(params) {
  async getAll(options: any) {
    console.log("SRV prod.serv getAll 1 : " + 1);
    // const { categoryId, brandId } = params;
    const { categoryId, brandId, limit, page } = options;
    const offset = (page - 1) * limit;
    const where: any = {};
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

  async getOne(id: number) {
    console.log("SRV prod.serv getOne 11 : " + 11);
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

  async create(
    data: CreateData,
    img: any /* : Express.Multer.File */
  ): Promise<Products> {
    console.log("SRV prod.serv CRE data - 11 : " + data);
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
    console.log("SRV prod.serv UPD data.props : " + data.props);
    if (data.props) {
      // ! ошб. Unexpected token o in JSON at position 1 - коммит parse от не нужного преобразованя JSON в объ.
      const props: ProductProp[] = JSON.parse(data.props);
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

  async update(
    id: number | string,
    data: UpdateData,
    img: any /* : Express.Multer.File */
  ) {
    console.log("SRV prod.serv UPD data - 11 : " + data);
    console.log(data);
    const product = await ProductMapping.findByPk(id, {
      include: [{ model: ProductPropMapping, as: "props" }],
    });
    console.log("SRV prod.serv UPD product : " + product);
    console.log(product);
    console.log("SRV prod.serv UPD product.props : " + product.props);
    console.log(product.props);
    if (!product) {
      throw new Error("Товар не найден в БД");
    }
    console.log("SRV prod.serv UPD 33 : " + 33);
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
    console.log("SRV prod.serv UPD 44 : " + 44);
    console.log("SRV prod.serv UPD DATA - 22 : " + data);
    console.log(data);
    console.log("SRV prod.serv UPD 444 : " + 444);
    await product.update({ name, price, image, categoryId, brandId });
    console.log("SRV prod.serv UPD 55 : " + 55);
    if (data.props) {
      console.log("SRV prod.serv UPD 66 : " + 66);
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

  async delete(id: number | string) {
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
  async isExist(id: number) {
    const basket = await ProductMapping.findByPk(id);
    return basket;
  }
}

export default new Product();
