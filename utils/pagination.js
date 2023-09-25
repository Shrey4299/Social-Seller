function paginate({ page = 0, pageSize = 10 }) {
  page = parseInt(page);
  pageSize = parseInt(pageSize);

  if (isNaN(page) || isNaN(pageSize) || page < 0 || pageSize < 1) {
    throw new Error("Invalid page or pageSize parameters");
  }

  const offset = page * pageSize;
  const limit = pageSize;

  return {
    offset,
    limit,
  };
}

module.exports = paginate;
