class QueryDto {
    page: number;

    limit: number;

    sort: string;

    search: string;
}

export class APIfeatures {
    constructor(
        private query: any,
        private queryString: QueryDto
    ) { }

    // this.query = query; // Products.find()
    // this.queryString = queryString; // req.query
    // limit(c) {
    //     return Array(this).filter((x, i) => {
    //         if (i <= (c - 1)) { return true }
    //     })
    // }
    limit(c, arr) {
        return Array(arr).filter((x, i) => {
            if (i <= (c - 1)) { return true }
        })
    }

    skip(c, arr) {
        return Array(arr).filter((x, i) => {
            if (i > (c - 1)) { return true }
        })
    }



    paginating() {
        const page = this.queryString.page * 1 || 1;
        const limit = this.queryString.limit * 1 || 5;
        const skip = limit * (page - 1);
        this.query = this.limit(limit, this.query);
        this.query = this.skip(skip, this.query);
        return this;
    }

    //this.query = Products.find().limit(limit).skip(skip)

    sorting() {
        const sort = this.queryString.sort || '-createdAt';
        this.query = this.query.sort(sort)
        return this;
    }

    //this.query = Products.find().limit(limit).skip(skip).sort(sort)

    searching() {
        const search = this.queryString.search;
        if (search) {
            this.query = this.query.find({
                $text: { $search: search }
            })
        } else {
            this.query = this.query.find()
        }
        return this;
    }
    //this.query = Products.find().find({
    //     $text: { $search: search }
    //  }).limit(limit).skip(skip).sort(sort)

    filtering() {
        const queryObj = { ...this.queryString }

        const excludedFields = ['page', 'sort', 'limit', 'search']
        excludedFields.forEach(el => delete (queryObj[el]))

        let queryStr = JSON.stringify(queryObj)
        queryStr = queryStr.replace(/\b(gte|gt|lt|lte|regex)\b/g, match => '$' + match)

        this.query = this.query.find(JSON.parse(queryStr))
        return this;
    }

    //this.query = Products.find().find({
    //     {"price":{"$gt":"56.99"}}
    //  }).limit(limit).skip(skip).sort(sort)
}