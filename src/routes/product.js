const express = require("express")
const Route = express.Router()
const product = require("../controllers/product")

const jwt = require('../helpers/jwt')

Route
    .post("/", product.assignProduct)
    .post("/upload-media", product.uploadMedia)
    .post("/upload-media-bulk", product.uploadMediaBulk)
    .post("/delete-media", product.deleteMedia)
    .post("/delete-media-bulk", product.deleteBulkMedia)
    .post("/delete-media-all", product.deleteAllMedia)
    .post("/delete/:id", product.deleteProduct)
    .post("/add/review", product.addReview)
    .post("/add/review/picture", product.addReviewPicture)
    .get("/categories", product.productCategories)
    .post("/category", product.assignCategory)
    .get("/category/:id", product.detailCategory)
    .post("/category/delete/:id", product.deleteCategory)
    .get("/conditions", product.getProductCondition)
    .get("/list", product.getAllProduct)
    .get("/list/review", product.listReview)
    .get("/detail/review/:product_id", product.detailReview)
    .get("/seller/list", jwt, product.getAllProductSeller)
    .get("/info/:id", product.getProductInfo)

module.exports = Route