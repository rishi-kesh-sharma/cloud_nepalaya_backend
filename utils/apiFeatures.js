class ApiFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
    this.next = true;
    this.prev = true;
  }
  search() {
    const keyword = this.queryStr.keyword
      ? {
          title: {
            $regex: this.queryStr.keyword,
            $options: "i",
          },
          author: {
            $regex: this.queryStr.keyword,
            $options: "i",
          },
        }
      : {};
    if (!keyword.title && !keyword.author) {
      this.query = this.query.find();
    } else {
      this.query = this.query.find({
        $or: [{ title: keyword["title"] }, { author: keyword["author"] }],
      });
    }

    this.totalCount = this.query.length;
    return this;
  }
  pagination(resultPerPage) {
    const currentPage = Number(this.queryStr.page) || 1;
    const skip = resultPerPage * (currentPage - 1);
    if (skip <= 0) {
      this.prev = false;
    }

    this.skip = skip;
    this.query = this.query.skip(skip).limit(resultPerPage);

    return this;
  }

  //   filter() {
  //     const queryCopy = { ...this.queryStr };
  //     // REMOVING SOME FIELDS COR CATEGORY
  //     const removeFields = ["keyword", "page", "limit"];
  //     removeFields.forEach((key) => delete queryCopy[key]);

  //     // FILER FOR PRICE AND RATING
  //     let queryStr = JSON.stringify(queryCopy);
  //     queryStr = queryStr.replace(
  //       /\b(gt | gte | lt | lte)\b/g,
  //       (key) => `$${key}`
  //     );
  //     this.query = this.query.find(JSON.parse(queryStr));

  //     this.query = this.query.find(queryCopy);
  //     return this;
  //   }
}
module.exports = ApiFeatures;
