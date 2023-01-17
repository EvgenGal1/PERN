const { Brand } = require("../models/models");
// const ApiError = require('../error/ApiError');

class BrandController {
  async create(req, res) {
    // const {name} = req.body
    // const brand = await Brand.create({name})
    // return res.json(brand)
  }

  async getAll(req, res) {
    // const brands = await Brand.findAll()
    // return res.json(brands)
  }

  // fn получ.1го устройства по id
  async getOne(req, res) {
    // const { id } = req.params;
    // const device = await Device.findOne({
    //   where: { id },
    //   include: [{ model: DeviceInfo, as: "info" }],
    // });
    // return res.json(device);
  }

  // ^ нужно прописать удалени конкретного и всех
  async update(req, res) {
    //     const brands = await Brand.findAll()
    //     return res.json(brands)
  }
  async delAll(req, res) {
    //     const brands = await Brand.findAll()
    //     return res.json(brands)
  }
  async delOne(req, res) {
    //     const brands = await Brand.findAll()
    //     return res.json(brands)
  }
}

module.exports = new BrandController();
