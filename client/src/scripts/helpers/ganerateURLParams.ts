interface Catalog {
  category?: string;
  brand?: string;
  page?: number;
  limit?: number;
  order?: string;
  field?: string;
}

interface Params {
  category?: string;
  brand?: string;
  page?: number;
  limit?: number;
  order?: string;
  field?: string;
}

export async function generateParams(catalog: Catalog): Promise<string> {
  // ^ стар.подход
  // const params: Params = {};
  // if (catalog.filters.category) params.category = catalog.filters.category;
  // if (catalog.filters.brand) params.brand = catalog.filters.brand;
  // if (catalog.pagination.page !== undefined && catalog.pagination.page > 1)
  //   params.page = catalog.pagination.page;
  // if (
  //   catalog.pagination.limit !== undefined &&
  //   catalog.pagination.limit !== 20 &&
  //   catalog.pagination.limit !== 0
  // )
  //   params.limit = catalog.pagination.limit;
  // if (catalog.sortSettings.order !== "ASC" || catalog.sortSettings.order !== null)
  //   params.order = catalog.sortSettings.order;
  // if (catalog.sortSettings.field !== "name" || catalog.sortSettings.field !== null)
  //   params.field = catalog.sortSettings.field;
  // return String(params);

  // ^ нов.подход
  const params: Params = Object.entries(catalog).reduce((acc, [key, value]) => {
    switch (key) {
      case "category":
      case "brand":
        if (value) acc[key as keyof Params] = value;
        break;
      case "page":
        if (value !== undefined && value > 1) acc.page = value;
        break;
      case "limit":
        if (value !== undefined && value > 0 && value !== 10) acc.limit = value;
        break;
      case "order":
      case "field":
        if (value) acc[key as keyof Params] = value;
        break;
      default:
        break;
    }
    return acc;
  }, {} as Params);

  return new URLSearchParams(params as Record<string, string>).toString();
}
