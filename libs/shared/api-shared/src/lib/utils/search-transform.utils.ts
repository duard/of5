export function parseSearch(search, searchBy) {
  const searchFields = Array.isArray(searchBy)
    ? searchBy.map(f => ({ [f]: { $contL: search } }))
    : [{ [searchBy]: { $contL: search } }];

  return searchFields;
}
