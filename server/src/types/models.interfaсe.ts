import UserModel from '../models/UserModel';
import RoleModel from '../models/RoleModel';
import UserRoleModel from '../models/UserRoleModel';
import BasketModel from '../models/BasketModel';
import TokenModel from '../models/TokenModel';
import BrandModel from '../models/BrandModel';
import CategoryModel from '../models/CategoryModel';
import ProductModel from '../models/ProductModel';
import ProductPropModel from '../models/ProductPropModel';
import OrderModel from '../models/OrderModel';
import OrderItemModel from '../models/OrderItemModel';
import BasketProductModel from '../models/BasketProductModel';
import RatingModel from '../models/RatingModel';
import CommandModel from '../models/CommandModel';

export interface Models {
  UserModel: typeof UserModel;
  RoleModel: typeof RoleModel;
  UserRoleModel: typeof UserRoleModel;
  BasketModel: typeof BasketModel;
  TokenModel: typeof TokenModel;
  BrandModel: typeof BrandModel;
  CategoryModel: typeof CategoryModel;
  ProductModel: typeof ProductModel;
  ProductPropModel: typeof ProductPropModel;
  OrderModel: typeof OrderModel;
  OrderItemModel: typeof OrderItemModel;
  BasketProductModel: typeof BasketProductModel;
  RatingModel: typeof RatingModel;
  CommandModel: typeof CommandModel;
}
