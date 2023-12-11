// `получить параметры поиска`
export const getSearchParams = (searchParams: any) => {
  console.log("hlp get searchParams ", searchParams);
  console.log("hlp get searchParams ", typeof searchParams);
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
  let page = searchParams.get("page");
  if (page && /[1-9][0-9]*/.test(page)) {
    page = parseInt(page);
  }
  let limit = searchParams.get("limit");
  if (limit && /[1-9][0-9]*/.test(limit)) {
    limit = parseInt(limit);
  }
  let sortOrd = searchParams.get("sortOrd");
  // if (sortOrd && /[a-z][A-Z]*/.test(sortOrd)) {
  //   sortOrd = parseInt(sortOrd);
  // }
  let sortField = searchParams.get("sortField");
  // if (sortField && /[a-z][A-Z]*/.test(sortField)) {
  //   sortField = parseInt(sortField);
  // }
  return {
    category,
    brand,
    page,
    limit,
    sortOrd,
    sortField,
  };
};
