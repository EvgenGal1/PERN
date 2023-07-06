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
  _limit = 15; // товаров на страницу
  _sortOrd = "ASC"; // сортировка по порядку
  _sortField = "name"; // сортировка по полю
  _totalPages = 1; // текущая страница
  _currentPage = 1; // сколько всего страниц

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

  get totalPages() {
    return this._totalPages;
  }

  get currentPage() {
    return this._currentPage;
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

  set sortOrd(sortOrd) {
    this._sortOrd = sortOrd;
  }

  set sortField(sortField) {
    this._sortField = sortField;
  }

  set totalPages(totalPages) {
    this._totalPages = totalPages;
  }

  set currentPage(currentPage) {
    this._currentPage = currentPage;
  }
}

export default CatalogStore;
