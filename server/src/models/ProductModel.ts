import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  Sequelize,
  CreationOptional,
} from 'sequelize';

import ProductPropModel from './ProductPropModel';
import CategoryModel from './CategoryModel';
import BrandModel from './BrandModel';
import RatingModel from './RatingModel';

class ProductModel extends Model<
  InferAttributes<ProductModel>,
  InferCreationAttributes<ProductModel>
> {
  // объяв.тип > атриб.модели (CreationOptional - мжн.пусто, авто.созд.)
  declare id: CreationOptional<number>;
  declare name: string;
  declare price: number;
  declare rating?: number;
  declare image: string;
  declare categoryId?: number | null;
  declare brandId?: number | null;

  // Ассоциации. Cвязанные моделей ток.чтен.со Мн.данн.
  public readonly props?: ProductPropModel[];
  public readonly category?: CategoryModel;
  public readonly brand?: BrandModel;
  public readonly ratings?: RatingModel[];

  // мтд.устан.связей м/у моделями
  static associate(models: any) {
    ProductModel.hasMany(models.ProductPropModel, {
      as: 'props',
      foreignKey: 'productId',
      onDelete: 'CASCADE',
    });
    ProductModel.belongsTo(models.CategoryModel, {
      as: 'category',
      foreignKey: 'categoryId',
    });
    ProductModel.belongsTo(models.BrandModel, {
      as: 'brand',
      foreignKey: 'brandId',
    });
    ProductModel.belongsToMany(models.UserModel, {
      through: models.RatingModel,
      as: 'ratings',
      foreignKey: 'productId', // указ.внешн.ключ
      otherKey: 'userId', // указ.доп.внешн.ключ
      onDelete: 'CASCADE',
    });
  }

  // мтд.инициализации модели, опред.структуры
  static initModel(sequelize: Sequelize) {
    ProductModel.init(
      {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        name: { type: DataTypes.STRING, unique: true, allowNull: false },
        price: { type: DataTypes.FLOAT, allowNull: false },
        rating: { type: DataTypes.FLOAT, defaultValue: 0 },
        image: { type: DataTypes.STRING, allowNull: false },
        categoryId: { type: DataTypes.INTEGER, allowNull: true },
        brandId: { type: DataTypes.INTEGER, allowNull: true },
      },
      { sequelize, tableName: 'products' },
    );
  }
}

export default ProductModel;
