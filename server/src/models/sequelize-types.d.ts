import { Model } from 'sequelize';

// Определение типов для User
export interface UserAttributes {
  id: number;
  username: string;
  email: string;
  password: string;
  isActivated?: boolean;
  activationLink?: string;
}

export interface UserCreationAttributes
  extends Partial<UserAttributes, 'id' | 'isActivated' | 'activationLink'> {}

// Определение модели User
export declare class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  id: number;
  username: string;
  email: string;
  password: string;
  isActivated: boolean;
  activationLink: string;
}

// Определение типов для Token
export interface TokenAttributes {
  id: number;
  userId: number;
  basketId: number;
  tokenRefresh?: string;
}

export interface TokenCreationAttributes
  extends Partial<TokenAttributes, 'id' | 'tokenRefresh'> {}

// Определение модели Token
export declare class Token
  extends Model<TokenAttributes, TokenCreationAttributes>
  implements TokenAttributes
{
  id: number;
  userId: number;
  basketId: number;
  refreshToken: string;
}

// Определение интерфейсов для моделей
export interface RoleAttributes {
  id: number;
  value: string;
  description?: string;
}

export interface RoleCreationAttributes
  extends Optional<RoleAttributes, 'id' | 'description'> {}

export class Role
  extends Model<RoleAttributes, RoleCreationAttributes>
  implements RoleAttributes
{
  public id!: number;
  public value!: string;
  public description?: string;
}

export interface UserRoleAttributes {
  id: number;
  userId: number;
  roleId: number;
  level: number;
}

export interface UserRoleCreationAttributes
  extends Optional<UserRoleAttributes, 'id'> {}

export class UserRole
  extends Model<UserRoleAttributes, UserRoleCreationAttributes>
  implements UserRoleAttributes
{
  public id!: number;
  public userId!: number;
  public roleId!: number;
  public level!: number;
}

// Определение интерфейса для модели Category
export interface CategoryAttributes {
  id?: number;
  name: string;
}

export interface CategoryCreationAttributes
  extends Optional<CategoryAttributes, 'id'> {}

export declare class Category
  extends Model<CategoryAttributes, CategoryCreationAttributes>
  implements CategoryAttributes
{
  public id!: number;
  public name!: string;
}

// Определение интерфейсов для моделей
export interface BasketAttributes {
  id?: number;
  userId: number;
}

export interface BasketProductAttributes {
  quantity: number;
  basketId: number;
  productId: number;
}

export interface BrandAttributes {
  id?: number;
  name: string;
}

export interface RatingAttributes {
  rate: string | number;
  userId: number;
  productId: number;
}

export interface ProductAttributes {
  id?: number;
  name: string;
  price: number;
  rating?: number;
  image: string;
  categoryId?: number;
  brandId?: number;
}

export class ProductModel
  extends Model<ProductAttributes>
  implements ProductAttributes
{
  public id!: number;
  public name!: string;
  public price!: number;
  public rating?: number;
  public image!: string;
  public categoryId!: number;
  public brandId!: number;
}

export interface ProductPropAttributes {
  id?: number;
  name: string;
  value: string;
  productId: number;
}

// Определение интерфейса для модели Order
export interface OrderAttributes {
  id?: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  amount: number;
  status: number;
  comment?: string;
  // userId?: number;
  prettyCreatedAt?: string;
  prettyUpdatedAt?: string;
  items?: OrderItemAttributes[];
}

export interface OrderCreationAttributes
  extends Optional<
    OrderAttributes,
    'id' | 'status' | 'comment' | 'userId' | 'items'
  > {}

class Order
  extends Model<OrderAttributes, OrderCreationAttributes>
  implements OrderAttributes
{
  public id!: number;
  public name!: string;
  public email!: string;
  public phone!: string;
  public address!: string;
  public amount!: number;
  public status!: number;
  public comment?: string;
  // public userId?: number;
}

export interface OrderItemAttributes {
  id?: number;
  name: string;
  price: number;
  quantity: number;
  orderId?: number;
}

export interface OrderItemCreationAttributes
  extends Optional<OrderItemAttributes, 'id'> {}
