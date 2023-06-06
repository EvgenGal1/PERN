import fs from "fs";
// подкл.генир.уник.рандом.id
const uuid = require("uuid");
// подкл.для созд.пути
const path = require("path");

class FileService {
  save(file: /* : Express.Multer.File */ any): string | null {
    if (!file) return null;
    try {
      const [, ext] = file.mimetype.split("/");
      const fileName = uuid.v4() + "." + ext;
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
