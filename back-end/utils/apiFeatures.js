export default class ApiFeatures {
  constructor(dbQuery, query) {
    this.dbQuery = dbQuery;
    this.query = query;
  }
  //advanced way for fields filtering
  filter() {
    // console.log(this.query);
    const queryObj = { ...this.query };
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    // console.log(queryStr);
    this.dbQuery.find(JSON.parse(queryStr));
    return this;
  }
  //sort the data
  sort() {
    if (this.query.sort) {
      const sortBy = this.query.sort.split(",").join(" ");
      this.dbQuery.sort(sortBy);
    }
    return this;
  }
  //limit the data
  limitFields() {
    if (this.query.fields) {
      const fields = this.query.fields.split(",").join(" ");
      this.dbQuery.select(fields);
    }
    return this;
  }
  //paginate the data
  paginate() {
    const page = parseInt(this.query.page, 10) || 1;
    const limit = parseInt(this.query.limit, 10) || 100;
    const startIndex = (page - 1) * limit;
    //const endIndex = page * limit;

    this.dbQuery.skip(startIndex).limit(limit);
    return this;
  }
}
