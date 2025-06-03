module.exports = class QueryManipulater {
    constructor(req, model) {
        this.req = req;
        this.model = model;
    }

    filter() {
        let queryStr = JSON.stringify(this.req.query);
        if (!queryStr.includes("$"))
            queryStr = queryStr.replace(/gte|gt|lte|lt/, match => `$${match}`);

        let filterObj = JSON.parse(queryStr);
        Object.keys(filterObj).forEach(prop => {
            if (['select', 'sort', "keyword", "page", "limit"].includes(prop))
                delete filterObj[prop];
        });

        this.query = this.model.find(filterObj);

        return this;
    }

    selectFields() {
        if (this.req.query.select) {
            let select = this.req.query.select.split(",").join(" ");
            this.query = this.query.select(select);
        } else {
            this.query = this.query.select("-__v");
        }
        return this;
    }

    sort() {
        if (this.req.query.sort) {
            let sort = this.req.query.select.split(",").join(" ");
            this.query = this.query.select(sort);
        } else {
            this.query = this.query.sort("-createdAt");

        }
        return this;
    }

    search() {
        if (this.req.query.keyword) {
            let filterObj = {};
            filterObj.$or = [
                { name: { $regex: this.req.query.keyword, $options: "i" } },
                { description: { $regex: this.req.query.keyword, $options: "i" } }
            ]
            this.query = this.query.find(filterObj);
        }
        return this;
    }

    paginate() {
        let page = this.req.query.page || 1;
        let limit = this.req.query.limit || Infinity;
        let skip = (page - 1) * limit;

        this.query = this.query.skip(skip).limit(limit);
        return this;
    }
}