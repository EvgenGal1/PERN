import Op from "sequelize";
import AppError from "../error/ApiError";
import {
  Product as ProductMapping,
  ProductProp as ProductPropMapping,
  Brand as BrandMapping,
  Category as CategoryMapping,
  Rating as RatingMapping,
} from "../models/mapping";
import FileService from "./file.service";

// Типы данных
interface Products {
  id: number;
  name: string;
  price: number;
  image: string;
  categoryId: number | null | any;
  brandId: number | null | any;
  props?: ProductProp[];
  category?: Category;
  brand?: Brand;
  // createdAt: Date;
  // updatedAt: Date;
}

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

interface ProductProp {
  id: number | any;
  name: string | any;
  value: string | any;
  productId: number | any;
  // createdAt: Date;
  // updatedAt: Date;
}

interface Category {
  id: number | any;
  name: string | any;
  // createdAt: Date;
  // updatedAt: Date;
}

interface Brand {
  id: number | any;
  name: string | any;
  // createdAt: Date;
  // updatedAt: Date;
}

class Product {
  async getAll(options: any) {
    const {
      categoryId,
      categoryId_q,
      brandId,
      brandId_q,
      limit,
      page,
      sortOrd,
      sortField,
    } = options;

    // перем.для уточнения запроса к др.Табл.
    let where: any = {};

    // ^ определение/запись кол-ва значений (if - мн. if else - одно)
    // Категории
    if (categoryId?.includes(",")) where.categoryId = categoryId.split(",");
    else if (categoryId && !categoryId?.includes(","))
      where.categoryId = categoryId;
    // Бренд
    if (brandId?.includes(",")) where.brandId = brandId.split(",");
    else if (brandId && !brandId?.includes(",")) where.brandId = brandId;

    // Кол-во эл. `Найдите и посчитайте все`
    let countAll = await ProductMapping.findAndCountAll({
      where,
      // для каждого товара получаем Бренд и Категорию
      include: [
        { model: BrandMapping, as: "brand" },
        { model: CategoryMapping, as: "category" },
      ],
    });

    // ! дораб - для сорт.по голосу(из Табл.Rating)
    let sortFieldVotes: any = {};
    // console.log("sortFieldVotes 0 : " + sortFieldVotes);
    // console.log(sortFieldVotes);
    if (sortField === "votes") {
      sortFieldVotes = `{ model: RatingMapping, as: "ratings" }`;
      // console.log("sortFieldVotes : " + sortFieldVotes);
      // console.log(sortFieldVotes);
    }
    let sortFieldParam = sortField;
    if (sortField === "votes") {
      // ! не раб.сортировка по votes, userId, rate|s, rating|s
      // sortFieldParam = `RatingMapping, "votes"`;
      sortFieldParam = `{ model: RatingMapping, as: "ratings" }, "rates"`;
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

    const products = await ProductMapping.findAndCountAll({
      where,
      limit,
      offset,
      // для каждого товара получаем бренд и категорию
      include: [
        // получаем все модели, вместе со связанными с ними моделями
        // { all: true, nested: true },
        { model: BrandMapping, as: "brand" },
        { model: CategoryMapping, as: "category" },
        // { model: ProductPropMapping, as: "props" },
        // sortFieldVotes
        // { model: RatingMapping, as: "ratings" },
      ],
      order: [[sortFieldParam || "name", sortOrd || "ASC"]],
    });

    return { ...products, limit };
  }

  async getOne(id: number) {
    // const product = await ProductMapping.findByPk(id);
    // const product = await ProductMapping.findOne({
    //   where: { id: id },
    const product = await ProductMapping.findByPk(id, {
      include: [
        { model: ProductPropMapping, as: "props" },
        // получать категорию и бренд
        { model: BrandMapping, as: "brand" },
        { model: CategoryMapping, as: "category" },
        // { model: RatingMapping, as: "ratings" },
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
    // поскольку image не допускает null, задаем пустую строку
    const image = FileService.save(img) ?? "";
    const { name, price, categoryId = null, brandId = null } = data;

    // перем.для уточнения записи запроса к др.Табл.
    let where: any = {};
    // перем.для вызова метода возврата Товара с Неск-им/Одним знач.
    let returned: any = {};

    // ^ для записи 1го знач.
    if ((categoryId.length || brandId.length) < 2) {
      // созд.1го Товара
      const product = await ProductMapping.create({
        name,
        price,
        image,
        categoryId,
        brandId,
      });
      // созд.свойства 1го Товара
      if (data.props) {
        const propsParse = JSON.parse(data.props);
        // получ.всегда первого массива
        let props = propsParse[0];
        // перебор масс. по эл.
        for (let prop of props) {
          // данн.из кажд.эл.сохр.по отдельности
          await ProductPropMapping.create({
            name: prop.name,
            value: prop.value,
            productId: product.id,
          });
        }
      }

      // возврат 1го Товар со свойствами
      returned = await ProductMapping.findByPk(product.id, {
        include: [{ model: ProductPropMapping, as: "props" }],
      });
    }

    // ^ для запись Неск-им знач.
    if (categoryId?.length > 1 || brandId?.length > 1) {
      // перем.всех разбитых парам.
      const resultAll = [];

      // ^ для render|state|загрузки на ОБЪЕКТЕ
      // // разбивка вход стр./объ. на масс. по запятой
      // let nameAll = name.split(",");
      // let priceAll = price.split(",");
      // let brandIdAll = brandId.split(",");
      // let categoryIdAll = categoryId.split(",");

      // для image отдельный split т.к. FileService возвращ.стр.имена ч/з запятую
      let imageAll = image.split(",");

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
          image: imageAll[i] || "",
        };

        // запись одного Товара в общ.перем.
        resultAll.push(allParam);
      }

      // массовое созд.
      const productBulk = await ProductMapping.bulkCreate(resultAll);

      // е/и есть Хар-ки Товара
      if (data.props) {
        // преобразуем вход.строку в объ/масс. с масс.объ.
        const propsParse = JSON.parse(data.props);
        // [
        //   0: [ { name: '1212', value: 'qw' }, { name: '121212', value: 'qwqw' } ],
        //   1: [ { name: '9898', value: 'as' } ]
        // ]

        // перебор всех key в Хар-ах
        for (let key of Object.keys(propsParse)) {
          // Object.keys(propsParse) - ['0', '1'] | key - 0 затем 1

          // получ.позиц.id нов.Товаров по key имеющихся Хар-ик (каждому Товару свои Хар-ки)
          let productBulkId = productBulk[key].id;
          // 304 затем 305

          // перем. масс.значений определённого key
          let value = propsParse[key];
          // [ { name: '1212', value: 'qw' }, { name: '121212', value: 'qwqw' } ]

          // перебор объ.в опред.масс.значений
          for (let prop of value) {
            // prop - { name: '1212', value: 'qw' } затем { name: '121212', value: 'qwqw' }
            // запись данн.каждого объ.по отдельности
            await ProductPropMapping.create({
              name: prop.name,
              value: prop.value,
              productId: productBulkId,
            });
          }
        }
      }

      // возврат неск. Товаров со свойствами и кол-ом
      returned = await ProductMapping.findAndCountAll({
        where,
        include: [{ model: ProductPropMapping, as: "props" }],
      });
    }

    // возвращ.результ.созд.
    return returned;
  }

  async update(
    id: number | string,
    data: UpdateData,
    img: any /* : Express.Multer.File */
  ) {
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
    // подготовка вход.данн. для обнов. в БД
    const {
      name = product.name,
      price = product.price,
      rating = product.rating,
      categoryId = product.categoryId,
      brandId = product.brandId,
      image = file ? file : product.image,
    } = data;

    await product.update({ name, price, rating, image, categoryId, brandId });

    // свойства товара
    if (data.props) {
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
