const express = require("express")
const Route = express.Router()
const callback = require("../controllers/callback")

Route
    .get("/", callback.callback)


Route.get("/ecommerce", callback.callbackEcommerce)

module.exports = Route