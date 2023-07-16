// ^ хранилище состояния каталога
import { makeAutoObservable } from "mobx";

class CatalogStore {
  _categories = [];
  _brands = [];
  _products = [];
  _orders = [];
  _category = null; // выбранная категория
  _brand = null; // выбранный бренд
  _order = null; // выбранный заказ
  _page = 1; // текущая страница
  _count = 0; // сколько всего товаров
  _limit = 0; // товаров на страницу
  _sortOrd = null; // "ASC"; // сортировка по порядку
  _sortField = null; // "name"; // сортировка по полю(назв.,цена,рейтинг)
  // доп.limit для скрытия его в url пока не выбран limit на странице
  _InterLimit = 0;

  constructor() {
    makeAutoObservable(this);
  }

  get categories() {
    return this._categories;
  }

  get brands() {
    return this._brands;
  }

  get products() {
    return this._products;
  }

  get orders() {
    return this._orders;
  }

  get category() {
    return this._category;
  }

  get brand() {
    return this._brand;
  }

  get order() {
    return this._order;
  }

  get page() {
    return this._page;
  }

  get count() {
    return this._count;
  }

  get limit() {
    return this._limit;
  }

  get InterLimit() {
    return this._InterLimit;
  }

  get sortOrd() {
    return this._sortOrd;
  }

  get sortField() {
    return this._sortField;
  }

  // всего страниц
  get pages() {
    return Math.ceil(this.count / this.limit);
  }

  set categories(categories) {
    this._categories = categories;
  }

  set brands(brands) {
    this._brands = brands;
  }

  set products(products) {
    this._products = products;
  }

  set orders(orders) {
    this._orders = orders;
  }

  set category(id) {
    this.page = 1;
    this._category = id;
  }

  set brand(id) {
    this.page = 1;
    this._brand = id;
  }

  set order(id) {
    this.page = 1;
    this._order = id;
  }

  set page(page) {
    this._page = page;
  }

  set count(count) {
    this._count = count;
  }

  set limit(limit) {
    this._limit = limit;
  }

  set InterLimit(InterLimit) {
    this._InterLimit = InterLimit;
  }

  set sortOrd(sortOrd) {
    this._sortOrd = sortOrd;
  }

  set sortField(sortField) {
    this._sortField = sortField;
  }
}

export default CatalogStore;
