// от ошб.повтор.объяв.перем в блоке
export {};

// подкл.генир.уник.рандом.id
const uuid = require("uuid");
// подкл.для созд.пути
const path = require("path");

class FileService {
  // ^ сделать неск.fn (запись, удаление, получение, обработка). Пока только сохр.
  saveFile(file) {
    try {
      // генирир.уник.имя(ч/з fn v4 + формат)
      const fileName = uuid.v4() + ".jpg";
      // путь для сохр.
      const filePath = path.resolve("static", fileName);
      file.mv(filePath);
      // ^ ИЛИ обобщаем всё вместе - `движение`перемещ.файлы с клиента в static/ |
      // file.mv(path.resolve(__dirname, "..", "static", fileName));
      return fileName;
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = new FileService();
