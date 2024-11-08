const express = require("express")
const Route = express.Router()
const pricelist = require("../controllers/pricelist")

const jwt = require('../helpers/jwt')

Route
    .get("/pricing-account", jwt, pricelist.priceAccountList)

module.exports = Route