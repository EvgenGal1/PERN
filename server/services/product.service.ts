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
    console.log("data : " + data);
    console.log(data);
    console.log(img);
    // поскольку image не допускает null, задаем пустую строку
    const image = FileService.save(img) ?? "";
    console.log("image : " + image);
    console.log(image);
    const { name, price, categoryId = null, brandId = null } = data;
    console.log(
      "name price categoryId brandId : " + name,
      price,
      categoryId,
      brandId
    );

    // let imagePr: any = image;

    let created: any = {};

    console.log("000 : " + 0);
    // е/и знач.не пусты
    // if ((name && price && categoryId && brandId) != null) {
    // console.log("111 : " + 111);

    // перем.для уточнения запроса к др.Табл.
    let where: any = {};

    // ^ для запись Неск-им знач.
    if (categoryId?.length > 1 || brandId?.length > 1) {
      console.log("Для Многих : " + 999);
      // where.categoryId = categoryId;
      // where.brandId = brandId;
      // where.name = name;
      // where.price = price;
      // where.image = image === "" || null ? ["", ""] : image;
      // where.categoryId = categoryId;
      // where.brandId = brandId;
      // console.log("Мн. where : " + where);
      // console.log(where);

      // imagePr = imagePr === "" || null ? ["", ""] : imagePr;
      // console.log("imagePr : " + imagePr);
      // console.log(imagePr);
      //  let rating === "" || null ? ["", ""] : image;
      // let rating = [0, 0];

      console.log(
        "TYPEOF name, image, categoryId brandId price : " + typeof name,
        typeof image,
        typeof categoryId,
        typeof brandId,
        typeof price
      );

      console.log("1 : " + 1);

      // ^ разбивка объекта с массивами на массив с объектами
      // const result = [];
      // // Получаем длину массивов
      // const length = brandId.length;
      // for (let i = 0; i < length; i++) {
      //   const newObj = {
      //     name:  name[i],
      //     price:  price[i],
      //     brandId:  brandId[i],
      //     categoryId:  categoryId[i],
      //     image:  image[i] || "",
      //   };
      //   result.push(newObj);
      // }
      // отправили
      // data = {
      //   brand: [3, 2], category: [3, 5], image: [],
      //   name: ["Чоппер", "CustomArt"], price: [999, 75000],
      // };
      // получается так:
      // [
      // {brandId: 3, categotyId: 3, image: "", name: "Чоппер", price: 999},
      // {brandId: 2, categotyId: 5, image: "", name: "CustomArt", price: 75000}
      // ]

      // ^ разбивка объ. на объ.
      const result = [];
      // const result = [name, price, categoryId, brandId];
      // const length = brandId.length;
      const arrLength = brandId.split(",");
      console.log("arrLength : " + arrLength);
      console.log(arrLength);
      const length = arrLength.length;
      console.log("length : " + length);
      // var str = "Hello, World, etc";
      // var myarray = str.split(",");
      // for (var i = 0; i < myarray.length; i++) {
      let nameQ = name.split(",");
      let priceQ = price.split(",");
      let brandIdQ = brandId.split(",");
      let categoryIdQ = categoryId.split(",");
      let imageQ = image.split(",");
      for (var i = 0; i < length; i++) {
        // console.log(myarray[i]);
        const newObj = {
          name: nameQ[i],
          price: priceQ[i],
          brandId: brandIdQ[i],
          categoryId: categoryIdQ[i],
          image: imageQ[i] || "",
          // image: image,
        };
        console.log("newObj : " + newObj);
        console.log(newObj);
        result.push(newObj);
      }
      console.log("result : " + result);
      console.log(result);
      //
      // разбить объект:
      // data = {
      //   brandId: "2,2", categoryId: "2,3",
      //   name: "Чоппер,12", price: "999,75000",
      // };
      // должно получиться так:
      // [
      // {brandId: 2, categotyId: 2, image: "", name: "Чоппер", price: 999},
      // {brandId: 2, categotyId: 3, image: "", name: "12", price: 75000}
      // ]

      // const productBulk = await ProductMapping.bulkCreate(
      const productBulk = await ProductMapping.bulkCreate(
        result
        // [{
        //     name,
        //     price,
        //     image,
        //     categoryId,
        //     brandId,
        // },]
      );
      console.log("productBulk : " + productBulk);
      // console.log(productBulk);

      console.log("2 : " + 2);
      if (data.props) {
        console.log("Мн. data.props : " + data.props);
        console.log(data.props);
        const props: ProductProp[] = JSON.parse(data.props);
        console.log("props : " + props);
        for (let prop of props) {
          console.log("Мн. prop : " + prop);
          console.log(prop);
          await ProductPropMapping.bulkCreate({
            name: prop.name,
            value: prop.value,
            productId: productBulk.id,
          });
        }
      }

      console.log("3 : " + 3);
      created = await ProductMapping.findAndCountAll(
        /* productBulk.id, */ {
          where,
          include: [{ model: ProductPropMapping, as: "props" }],
        }
      );
    }

    console.log("222 : " + 222);
    // ^ для записи по одному знач.
    // console.log("name[0] : " + name[0]);
    // console.log(name.length);
    // console.log("Array.isArray(name) : " + Array.isArray(name));
    console.log(
      "typeof categoryId brandId price : " + typeof categoryId,
      typeof brandId,
      typeof price
    );
    if (
      (categoryId.length || brandId.length || price.length) < 2
      // (typeof categoryId || typeof brandId || typeof price) === "number" ||
      // "string"
      //  && (typeof categoryId || typeof brandId || typeof price) !== "object"
    ) {
      console.log("Для 1го : " + 1);
      // созд.1го
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
        const props: ProductProp[] = JSON.parse(data.props);
        console.log("1го data.props : " + data.props);
        console.log(data.props);
        for (let prop of props) {
          console.log("1го prop : " + prop);
          console.log(prop);
          await ProductPropMapping.create({
            name: prop.name,
            value: prop.value,
            productId: product.id,
          });
        }
      }
      // возвращать будем товар со свойствами
      created = await ProductMapping.findByPk(product.id, {
        include: [{ model: ProductPropMapping, as: "props" }],
      });
    }
    // }
    console.log("333 : " + 333);
    console.log("created : " + created);
    // console.log(created);
    return created;
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
