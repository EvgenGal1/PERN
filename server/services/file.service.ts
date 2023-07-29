import fs from "fs";
// подкл.генир.уник.рандом.id
const uuid = require("uuid");
// подкл.для созд.пути
const path = require("path");

class FileService {
  save(file: /* : Express.Multer.File */ any): string | null {
    if (!file) return null;
    try {
      console.log("file : " + file);
      console.log('file.mimetype.split("/") : ' + file.mimetype.split("/"));
      const [, ext] = file.mimetype.split("/");
      console.log("ext : " + ext);
      console.log(ext);
      // генирир.уник.имя(ч/з fn v4(подтвержд.уч.зап.) + формат)
      const fileName = uuid.v4() + "." + ext;
      console.log("fileName : " + fileName);
      // путь для сохр.
      const filePath = path.resolve("static", fileName);
      file.mv(filePath);
      return fileName;
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
