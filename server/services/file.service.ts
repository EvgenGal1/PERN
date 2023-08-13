import fs from "fs";
// подкл.генир.уник.рандом.id
const uuid = require("uuid");
// подкл.для созд.пути
const path = require("path");

class FileService {
  save(file: /* : Express.Multer.File */ any): string | null {
    if (!file) return null;
    try {
      // ^ заливка 1го ИЗО
      if (file.length < 2) {
        // достаём формат файла из mimetype ч/з split после слеша(/)
        const [, ext] = file.mimetype.split("/");
        // генирир.уник.имя(ч/з fn v4(подтвержд.уч.зап.) + раздел.имени/формата(.) + формат)
        const fileName = uuid.v4() + "." + ext;
        // путь для сохр.
        const filePath = path.resolve("static", fileName);
        file.mv(filePath);
        return fileName;
      }

      // ^ масс.заливка ИЗО
      if (file.length > 1) {
        // перем.масс.всех названий
        let allNames: any = [];
        // перебор по длине
        for (var i = 0; i < file.length; i++) {
          const oneFile = file[i];
          const [, ext] = oneFile.mimetype.split("/");
          const fileName = uuid.v4() + "." + ext;
          const filePath = path.resolve("static", fileName);
          oneFile.mv(filePath);
          // запись 1го зазв.в общ.масс.
          allNames.push(fileName);
        }
        // превращ.в строку для перебора в prod.serv.
        allNames = allNames.join(",");
        return allNames;
      }
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  delete(file: string): void {
    if (file) {
      const filePath = path.resolve("static", file);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
  }
}

export default new FileService();
