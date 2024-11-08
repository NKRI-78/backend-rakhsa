const express = require("express")
const Route = express.Router()
const checkout = require("../controllers/checkout")
const jwt = require('../helpers/jwt')

Route
    .post("/product/add/buy-now", jwt, checkout.addProductShoppingLive)
    .get("/product-live/info", jwt, checkout.getProductShoppingLive)
    .post("/courier-cost-list", jwt, checkout.courierCostList)
    .post("/", jwt, checkout.checkoutOrder)

module.exports = Route