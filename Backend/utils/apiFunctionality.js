class APIFunctionality {

    constructor(query, queryStr) {

        this.query = query,
            this.queryStr = queryStr

    };

    search() {
        const keyword = this.queryStr.keyword ? {
            $or: [
                { name: { $regex: this.queryStr.keyword, $options: "i" } },
                { keywords: { $regex: this.queryStr.keyword, $options: "i" } },
                { description: { $regex: this.queryStr.keyword, $options: "i" } }
            ]
        } : {};

        console.log("Keyword filter:", keyword);

        this.query = this.query.find({ ...keyword });
        console.log("Mongo query after search:", this.query.getQuery());
        return this;
    }


    filter() {
        const queryCopy = { ...this.queryStr };
        console.log("Query before removing fields:", queryCopy);

        const removeFields = ["keyword", "page", "limit"];
        removeFields.forEach(key => delete queryCopy[key]);

        console.log("Query after removing fields:", queryCopy);

        this.query = this.query.find(queryCopy);
        console.log("Mongo query after filter:", this.query.getQuery());

        return this;
    }


    pagination(resultPerPage) {

        const currentPage = (+this.queryStr.page) || 1;
        const skip = resultPerPage * (currentPage - 1);
        this.query = this.query.limit(resultPerPage).skip(skip);
        return this


    }

};

export default APIFunctionality;
