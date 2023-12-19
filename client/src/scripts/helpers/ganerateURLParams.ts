export async function generateParams(catalog: any) {
  const params: any = {};
  if (catalog.category) params.category = catalog.category;
  if (catalog.brand) params.brand = catalog.brand;
  if (catalog.page > 1) params.page = catalog.page;
  if (catalog.limit !== (20 || 0)) params.limit = catalog.limit;
  if (catalog.sortOrd !== ("ASC" || null)) params.sortOrd = catalog.sortOrd;
  if (catalog.sortField !== ("name" || null))
    params.sortField = catalog.sortField;

  return String(params);
}
