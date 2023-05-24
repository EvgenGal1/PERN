import * as uuid from "uuid";
import * as path from "path";

class FileService {
  save(file) {
    if (!file) return null;
    try {
      const [, ext] = file.mimetype.split("/");
      const fileName = uuid.v4() + "." + ext;
      const filePath = path.resolve("static", fileName);
      file.mv(filePath);
      return fileName;
    } catch (e) {
      console.log(e);
    }
  }

  // ! не раб. - FileService.delete is not a function
  // ^ врем.пропис.заглушку. Дописать!
  delete(file) {
    if (!file) return null;
    try {
      // const product = ProductMapping.findByPk(id);
      // if (!product) {
      //   throw new Error("Товар не найден в БД");
      // }
      // product.destroy();
      // return product;
    } catch (e) {
      console.log(e);
    }
  }
}

export default new FileService();
