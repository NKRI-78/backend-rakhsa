const express = require("express")
const Route = express.Router()
const cart = require("../controllers/cart")
const jwt = require('../helpers/jwt')

Route
    .post("/add", jwt, cart.createCart)
    .post("/update/selected/:cart_id", jwt, cart.updateCartSelected)
    .post("/update/quantity", jwt, cart.updateQuantityCart)
    .post("/update/note", jwt, cart.updateNoteCart)
    .post("/live/update/note", jwt, cart.updateNoteBuyLive)
    .post("/delete", jwt, cart.deleteCart)
    .get("/info", jwt, cart.getCartInfo)

module.exports = Route