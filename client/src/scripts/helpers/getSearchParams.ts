// `получить параметры поиска`
export const getSearchParams = (searchParams: URLSearchParams) => {
  // console.log("hlp get searchParams ", searchParams);
  // console.log("hlp get searchParams ", typeof searchParams);
  let category = searchParams.get("category");
  // ^ стар.логика (для 1го значения)
  // if (category && /[1-9][0-9]*/.test(category)) {
  // category = parseInt(category);
  // ^ нов.логика (для неск.значен.ч/з разделитель(_))
  if (category && /(_?[0-9]+)*/.test(category)) {
    category = "" + category;
  }
  let brand = searchParams.get("brand");
  // if (brand && /[1-9][0-9]*/.test(brand)) {
  //   brand = parseInt(brand);
  if (brand && /(_?[0-9]+)*/.test(brand)) {
    brand = "" + brand;
  }
  const page = searchParams.get("page");
  let pageNumber: number | null = null;
  if (page && /[1-9][0-9]*/.test(page)) {
    pageNumber = parseInt(page);
  }
  let limit = searchParams.get("limit");
  if (limit && /[1-9][0-9]*/.test(limit)) {
    limit = parseInt(limit) as unknown as string;
  }
  const sortOrd = searchParams.get("sortOrd");
  // if (sortOrd && /[a-z][A-Z]*/.test(sortOrd)) {
  //   sortOrd = parseInt(sortOrd);
  // }
  const sortField = searchParams.get("sortField");
  // if (sortField && /[a-z][A-Z]*/.test(sortField)) {
  //   sortField = parseInt(sortField);
  // }
  return {
    category,
    brand,
    page: pageNumber,
    limit,
    sortOrd,
    sortField,
  };
};
