// `получить параметры поиска`
export const getSearchParams = (
  searchParams: URLSearchParams
): Record<string, string | null> => {
  // ^ стар.подход
  // let category = searchParams.get("category");
  // // логика (для 1го значения)
  // // if (category && /[1-9][0-9]*/.test(category)) {
  // // category = parseInt(category);
  // // логика (для неск.значен.ч/з разделитель(_))
  // if (category && /(_?[0-9]+)*/.test(category)) {
  //   category = "" + category;
  // }
  // let brand = searchParams.get("brand");
  // if (brand && /(_?[0-9]+)*/.test(brand)) {
  //   brand = "" + brand;
  // }

  // const page = searchParams.get("page");
  // let pageNumber: number | null = null;
  // if (page && /[1-9][0-9]*/.test(page)) {
  //   pageNumber = parseInt(page);
  // }
  // const pageNumber = page && /^[1-9][0-9]*$/.test(page) ? parseInt(page) : null;
  // const limit = searchParams.get("limit");
  // const validatedLimit =
  //   limit && /^[1-9][0-9]*$/.test(limit) ? parseInt(limit) : null;
  // const order = searchParams.get("order");
  // const field = searchParams.get("field");
  // return {
  //   category,
  //   brand,
  //   page: pageNumber,
  //   limit: validatedLimit,
  //   order,
  //   field,
  // };

  // ^ нов.подход
  const params: Record<string, string | null> = {};
  params.category = searchParams.get("category") || null;
  params.brand = searchParams.get("brand") || null;
  params.page = searchParams.get("page") || "1";
  params.limit = searchParams.get("limit") || "10";
  params.field = searchParams.get("field") || "name";
  params.order = searchParams.get("order") || "ASC";
  return params;
};
