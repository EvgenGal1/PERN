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
}

export default new FileService();
