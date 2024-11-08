const { decodeToken } = require('../helpers/decode')

const misc = require('../helpers/response')
const Product = require('../models/Product')

module.exports = {

    assignProduct: async (req, res) => {
        const decoded = decodeToken(req.get("Authorization"))
        const userId = decoded.uid

        const { uid, name, category_id, price,
            weight, description,
            stock, condition, min_order, open
        } = req.body

        try {

            const storeId = await Product.getStoreId(userId);

            var data = {
                uid: uid,
                name: name,
                category_id: category_id,
                price: price,
                weight: weight,
                description: description,
                stock: stock,
                condition: condition,
                min_order: min_order,
                store_id: storeId,
                open: open
            }

            await Product.assignProduct(data)

            misc.response(res, 200, false, "")
        } catch (e) {
            console.log(e)
            misc.response(res, 400, false, e.message)
        }
    },

    assignCategory: async (req, res) => {
        const decoded = decodeToken(req.get("Authorization"))
        const storeId = decoded.store_id

        const { uid, name, path, categoryStatus, type
        } = req.body

        try {
            var data = {
                uid: uid,
                name: name,
                path: path,
                status: categoryStatus,
                type: type,
            }
            await Product.assignCategory(data)
            misc.response(res, 200, false, "")
        } catch (e) {
            console.log(e)
            misc.response(res, 400, false, e.message)
        }
    },

    productCategories: async (req, res) => {
        try {
            const categories = await Product.productCategories()

            var data = []

            for (var i in categories) {
                var category = categories[i]

                data.push({
                    id: category.category_id,
                    name: category.name,
                    type: category.type,
                    picture: category.picture,
                    status: category.status
                })
            }

            misc.response(res, 200, false, "", data)
        } catch (e) {
            misc.response(res, 400, false, e.message)
        }
    },

    uploadMedia: async (req, res) => {
        const { product_id, path } = req.body

        try {

            await Product.uploadMedia(product_id, path)

            misc.response(res, 200, false, "")
        } catch (e) {
            misc.response(res, 400, false, e.message)
        }
    },

    uploadMediaBulk: async (req, res) => {
        const { product_id, paths } = req.body
        try {
            await Product.uploadMediaBulk(product_id, paths)

            misc.response(res, 200, false, "")
        } catch (e) {
            misc.response(res, 400, false, e.message)
        }
    },

    deleteMedia: async (req, res) => {
        const { product_id, path } = req.body

        try {

            await Product.deleteMedia(product_id, path)

            misc.response(res, 200, false, "")
        } catch (e) {
            misc.response(res, 400, false, e.message)
        }
    },

    deleteBulkMedia: async (req, res) => {
        const { product_id, paths } = req.body
        try {
            await Product.deleteMediaBulk(product_id, paths)
            misc.response(res, 200, false, "")
        } catch (e) {
            misc.response(res, 400, false, e.message)
        }
    },

    deleteAllMedia: async (req, res) => {
        const { product_id } = req.body
        try {
            await Product.deleteMediaAll(product_id)
            misc.response(res, 200, false, "")
        } catch (e) {
            misc.response(res, 400, false, e.message)
        }
    },

    getAllProduct: async (req, res) => {
        var page = parseInt(req.query.page) || 1
        var limit = parseInt(req.query.limit) || 10
        var search = req.query.search || ''
        var category = req.query.cat || ''
        var offset = (page - 1) * limit

        try {

            var data = {
                page: page,
                limit: limit,
                search: search,
                category: category,
                offset: offset
            }

            const products = await Product.getAllProduct(data)

            var resultTotal = limit > 10 ? Math.ceil(products.length / limit) : products.length
            var perPage = Math.ceil(resultTotal / limit)
            var prevPage = page === 1 ? 1 : page - 1
            var nextPage = page === perPage ? 1 : page + 1

            var data = []

            for (var i in products) {
                var product = products[i]

                const reviews = await Product.getProductReview(product.id)

                var reviewData = reviews.length != 0
                    ? {
                        id: reviews[0].product_id ?? "-",
                        rating: `${reviews[0].averagerate == null ? '0.0' : reviews[0].averagerate}`,
                        total: reviews[0].total
                    }
                    : {

                    }

                data.push({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    weight: product.weight,
                    picture: product.picture != null
                        ? product.picture.includes(',')
                            ? product.picture.split(',')[0]
                            : product.picture
                        : "-",
                    description: product.description,
                    stock: product.stock,
                    min_order: product.min_order,
                    condition: product.condition_name,
                    category: {
                        id: product.category_id,
                        name: product.category_name,
                        type: product.category_type
                    },
                    review: reviewData,
                    store: {
                        id: product.store_id,
                        name: product.store_name,
                        picture: product.store_picture,
                        description: product.store_description,
                        address: {
                            province: product.store_province,
                            city: product.store_city,
                            subdistrict: product.store_subdistrict
                        }
                    }
                })
            }

            misc.response(res, 200, false, "", {
                total: resultTotal,
                per_page: perPage,
                next_page: nextPage,
                prev_page: prevPage,
                current_page: page,
                next_url: `${process.env.BASE_URL}${req.originalUrl.replace("page=" + page, "page=" + nextPage)}`,
                prev_url: `${process.env.BASE_URL}${req.originalUrl.replace("page=" + page, "page=" + prevPage)}`,
                data: data
            })
        } catch (e) {
            misc.response(res, 400, false, e.message)
        }
    },

    getProductCondition: async (_, res) => {
        try {
            const productConditions = await Product.getProductCondition()

            var data = [];

            for (var i in productConditions) {
                var productCondition = productConditions[i];
                data.push({
                    id: productCondition.uid,
                    name: productCondition.name
                });
            }

            misc.response(res, 200, false, "", data)
        } catch (e) {
            console.log(e)
            misc.response(res, 400, false, e.message)
        }
    },

    getProductInfo: async (req, res) => {
        const { id } = req.params

        try {

            const products = await Product.getProductInfo(id)

            if (products.length == 0)
                throw new Error("Product not found")

            const carts = await Product.getCartProductId(id)

            var result = products[0]

            const reviews = await Product.getProductReview(result.id)

            var reviewData = reviews.length != 0
                ? {
                    id: reviews[0].product_id ?? "-",
                    rating: `${reviews[0].averagerate == null
                        ? '0.0'
                        : reviews[0].averagerate}`,
                    total: reviews[0].total
                }
                : {}

            var pictures

            if (result.picture == null) {
                pictures = []
            } else {
                if (result.picture.includes(',')) {
                    var p = []
                    for (var i in result.picture.split(',')) {
                        var pro = result.picture.split(',')[i]
                        p.push({
                            path: pro
                        })
                    }
                    pictures = p
                } else {
                    pictures = [{
                        path: result.picture
                    }]
                }
            }

            var data = {
                id: result.id,
                owner: result.owner,
                name: result.name,
                price: result.price,
                weight: result.weight,
                status: result.status,
                pictures: pictures,
                description: result.description,
                stock: result.stock,
                is_out_stock: carts.length == 0
                    ? false
                    : carts[0].quantity == result.stock
                        ? true
                        : false,
                min_order: result.min_order,
                condition: {
                    id: result.condition_id,
                    name: result.condition_name
                },
                category: {
                    id: result.category_id,
                    name: result.category_name,
                    type: result.category_type
                },
                review: reviewData,
                store: {
                    id: result.store_id,
                    name: result.store_name,
                    picture: result.store_picture,
                    description: result.store_description,
                    city: result.store_city
                },
            }

            misc.response(res, 200, false, "", data)
        } catch (e) {
            misc.response(res, 400, false, e.message)
        }
    },

    deleteProduct: async (req, res) => {
        const { id } = req.params

        try {

            await Product.productDeletePicture(id)

            await Product.productDelete(id)

            misc.response(res, 200, false, "")
        } catch (e) {
            misc.response(res, 400, false, e.message)
        }
    },

    deleteCategory: async (req, res) => {
        const { id } = req.params

        try {

            await Product.categoryDelete(id)

            misc.response(res, 200, false, "")
        } catch (e) {
            misc.response(res, 400, false, e.message)
        }
    },

    detailCategory: async (req, res) => {
        const { id } = req.params

        try {

            var data = await Product.detailCategory(id)

            misc.response(res, 200, false, "Result Found", data)
        } catch (e) {
            misc.response(res, 400, false, e.message)
        }
    },


    getAllProductSeller: async (req, res) => {
        const decoded = decodeToken(req.get("Authorization"))
        const userId = decoded.uid

        var page = parseInt(req.query.page) || 1
        var limit = parseInt(req.query.limit) || 10
        var categoryId = req.query.categoryId || ''
        var search = req.query.search || ''
        var offset = (page - 1) * limit

        try {

            var data = {
                user_id: userId,
                search: search,
                offset: offset,
                limit: limit,
                categoryId: categoryId,
            }

            const products = await Product.getAllProductSeller(data)

            var data = []

            for (var i = 0; i < products.length; i++) {
                var product = products[i];

                const pictures = await Product.getProductPictureByProductId(product.product_id)

                data.push({
                    id: product.product_id,
                    name: product.name,
                    picture: pictures.length == 0 ? '-' : pictures[0].path,
                    price: product.price,
                    stock: product.stock,
                    status: product.status,
                });
            }

            misc.response(res, 200, false, "", data)
        } catch (e) {
            misc.response(res, 400, false, e.message)
        }
    },

    listReview: async (_, res) => {
        try {

            const reviews = await Product.listReview()

            var data = []

            for (var i in reviews) {
                var review = reviews[i]

                const pictures = await db.query(`SELECT path FROM product_review_pictures WHERE review_id = '${review.uid}'`);

                data.push({
                    avatar: review.profile_pic,
                    picture: pictures,
                    name: review.name,
                    caption: review.caption ?? "",
                    rating: review.rating,
                })
            }

            misc.response(res, 200, false, "", data)
        } catch (e) {
            misc.response(res, 400, true, e.message)
        }
    },

    detailReview: async (req, res) => {
        const { product_id } = req.params

        try {

            const reviews = await Product.detailReview(product_id)

            // console.log(reviews)

            var data = []

            for (var i in reviews) {
                var review = reviews[i]

                const pictures = await Product.getProductPictureReviewByReviewId(review.uid)

                data.push({
                    avatar: review.avatar,
                    review_pictures: Object.values(pictures).map(val => val.path),
                    name: review.fullname,
                    caption: review.caption ?? "",
                    rating: review.rating,
                    created_at: review.created_at
                })
            }

            misc.response(res, 200, false, "", data)
        } catch (e) {
            misc.response(res, 400, true, e.message)
        }
    },

    addReview: async (req, res) => {
        const decoded = decodeToken(req.get("Authorization"))
        const userId = decoded.uid

        const { id, product_id, transaction_id, rating, caption } = req.body

        try {

            var data = {
                id: id,
                product_id: product_id,
                user_id: userId,
                transaction_id: transaction_id,
                rating: rating,
                caption: caption
            }

            await Product.addReview(data)

            misc.response(res, 200, false, "")
        } catch (e) {
            misc.response(res, 400, true, e.message)
        }
    },

    addReviewPicture: async (req, res) => {
        const { id, path } = req.body

        try {

            await Product.addReviewPicture(id, path)

            misc.response(res, 200, false, "");
        } catch (e) {
            misc.response(res, 400, true, e.message)
        }
    },
}