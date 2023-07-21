//
class APIFeatures {
  constructor(mongooseQuery, queryString) {
    this.mongooseQuery = mongooseQuery;
    this.queryString = queryString;
    // console.log("mongooseQuery : ", this.mongooseQuery);
  }
  /* --------------------------------- Filter --------------------------------- */

  filter() {
    const queryStringObject = { ...this.queryString };
    // Excluded Fields
    const excludedFields = ["page", "sort", "limit", "fields", "keyword"];
    // Search for Fields and Exclude them
    excludedFields.forEach((field) => delete queryStringObject[field]);
    /* -------------------------  // Add '$' to req.query ------------------------ */
    let queryStr = JSON.stringify(queryStringObject);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    this.mongooseQuery = this.mongooseQuery.find(JSON.parse(queryStr));
    return this;
  }

  /* ---------------------------------- Sort ---------------------------------- */

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.sort(sortBy);
    } else {
      this.mongooseQuery = this.mongooseQuery.sort("-createdAt");
    }
    return this;
  }

  /* ---------------------------------- Limit --------------------------------- */

  limit() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.select(fields);
    } else {
      this.mongooseQuery = this.mongooseQuery.select("-__v");
    }
    return this;
  }

  /* --------------------------------- Search --------------------------------- */

  search(modelName) {
    if (this.queryString.keyword) {
      const query = {};
      if(modelName === "Product"){
        query.$or = [
          { title: { $regex: this.queryString.keyword, $options: "i" } },
          { description: { $regex: this.queryString.keyword, $options: "i" } },
        ];
      } else {
        query.$or = [
          { name: { $regex: this.queryString.keyword, $options: "i" } },
        ];
      }
      
      this.mongooseQuery = this.mongooseQuery.find(query);
    }
    return this;
  }

  /* -------------------------------- Paginate -------------------------------- */

  paginate(countDocuments) {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 50;
    const skip = (page - 1) * limit;
    const endIndex = page * limit;

    // Pagination result
    const pagination = {};
    pagination.currentPage = page;
    pagination.limit = limit;
    pagination.numberOfPages = Math.ceil(countDocuments / limit);

    // next page
    if (endIndex < countDocuments) {
      pagination.next = page + 1;
    }
    if (skip > 0) {
      pagination.prev = page - 1;
    }
    this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);

    this.paginationResult = pagination;
    return this;
  }
}

module.exports = APIFeatures;
