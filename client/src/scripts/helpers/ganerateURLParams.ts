export async function generateParams(catalog: any) {
  interface Params {
    category?: string;
    brand?: string;
    page?: number;
    limit?: number;
    sortOrd?: string;
    sortField?: string;
  }

  const params: Params = {};
  if (catalog.category) params.category = catalog.category;
  if (catalog.brand) params.brand = catalog.brand;
  if (catalog.page > 1) params.page = catalog.page;
  if (catalog.limit !== 20 || catalog.limit !== 0) params.limit = catalog.limit;
  if (catalog.sortOrd !== "ASC" || catalog.sortOrd !== null)
    params.sortOrd = catalog.sortOrd;
  if (catalog.sortField !== "name" || catalog.sortField !== null)
    params.sortField = catalog.sortField;

  return String(params);
}
