const express = require("express")
const Route = express.Router()
const shipping = require("../controllers/shipping_address")
const jwt = require('../helpers/jwt')

Route
    .post('/', jwt, shipping.assignShippingAddress)
    .get('/select/:id', jwt, shipping.selectPrimaryAddress)
    .get('/list', jwt, shipping.getAllShippingAddress)
    .get('/primary-info', jwt, shipping.getShippingAddressPrimaryInfo)
    .get('/info/:id', jwt, shipping.getShippingAddressInfo)
    .post('/delete', jwt, shipping.deleteShippingAddress)

module.exports = Route
