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
    // ^ для сорт по Неск-им знач.
    // ! врем.здесь(под расшир.поиск будет созд.отд.метод)
    if (categoryId_q != null) {
      if (categoryId_q?.length > 1) {
        // whereParam_q = `
        //
        // where = `
        //   where: {
        //     categoryId: {
        //       [Op.and]: ${categoryId_q},
        //     },
        //   },`;
        //
        // where.categoryId = { [Op.and]: categoryId_q };
        where.categoryId = categoryId_q;
      }
    }
    // ! врем.здесь(под расшир.поиск будет созд.отд.метод)
    // ^ для сорт по одному знач.
    if (categoryId_q === null) {
      if (categoryId) where.categoryId = categoryId;
      if (brandId) where.brandId = brandId;
    }

    // Кол-во эл. `Найдите и посчитайте все`
    let countAll = await ProductMapping.findAndCountAll({
      where,
      // для каждого товара получаем бренд и категорию
      include: [
        { model: BrandMapping, as: "brand" },
        { model: CategoryMapping, as: "category" },
      ],
    });

    // для сорт.по голосу(из Табл.Rating)
    let sortFieldVotes: any = {};
    console.log("sortFieldVotes 0 : " + sortFieldVotes);
    console.log(sortFieldVotes);
    if (sortField === "votes") {
      sortFieldVotes = `{ model: RatingMapping, as: "ratings" }`;
      console.log("sortFieldVotes : " + sortFieldVotes);
      console.log(sortFieldVotes);
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

    console.log("sortFieldVotes 111 : " + sortFieldVotes);
    console.log("where : " + where);
    console.log(where);
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
    // console.log("products : " + products);
    // console.log(products.rows[0]);
    // console.log("products.count " + products.count);
    // console.log(products.rows[0]);
    // console.log(products.count);
    // return products;
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
    if ((categoryId.length || brandId.length || price.length) < 2) {
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
      // возврат 1го Товар со свойствами
      returned = await ProductMapping.findByPk(product.id, {
        include: [{ model: ProductPropMapping, as: "props" }],
      });
    }

    // ^ для запись Неск-им знач.
    if (categoryId?.length > 1 || brandId?.length > 1) {
      // перем.всех разбитых парам.
      const resultAll = [];
      // разбивка вход стр./объ. на масс. по запятой
      console.log("name : " + name);
      console.log(name);
      let nameAll = name.split(",");
      console.log("nameAll : " + nameAll);
      console.log(nameAll);
      let priceAll = price.split(",");
      let brandIdAll = brandId.split(",");
      let categoryIdAll = categoryId.split(",");
      let imageAll = image.split(",");
      // цикл по длине какого-либо парам.
      for (var i = 0; i < nameAll.length; i++) {
        // один Товар в переборе
        const allParam = {
          name: nameAll[i],
          price: priceAll[i],
          brandId: brandIdAll[i],
          categoryId: categoryIdAll[i],
          image: imageAll[i] || "",
        };
        // запись одного Товара в общ.перем.
        resultAll.push(allParam);
      }

      // массовое созд.
      const productBulk = await ProductMapping.bulkCreate(resultAll);
      console.log("productBulk?.id : " + productBulk?.id);
      console.log(productBulk?.id);

      // е/и есть Хар-ки Товара
      if (data.props) {
        console.log("Мн. data.props : " + data.props);
        console.log(data.props);

        // перем.всех props
        let propsDate = data.props;
        // перем.всех разбитых хар-ик.
        const resultAll = [];
        // разбивка вход стр./объ. на масс. по запятой
        let propsAll = propsDate.split(",");
        console.log("propsAll : " + propsAll);
        console.log(propsAll);

        // цикл по длине какого-либо хар-ки.
        for (var i = 0; i < propsAll.length; i++) {
          console.log("i : " + i);
          console.log(i);
          // props
          const propsOne: ProductProp[] = JSON.parse(propsAll);
          console.log("propsOne : " + propsOne);
          console.log(propsOne);
          for (let prop of propsOne) {
            console.log("Мн. prop : " + prop);
            console.log(prop);
            await ProductPropMapping.bulkCreate({
              name: prop.name,
              value: prop.value,
              productId: productBulk.id,
            });
          }
        }
      }

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
