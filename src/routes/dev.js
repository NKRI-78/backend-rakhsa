const express = require("express")
const Route = express.Router()
const dev = require("../controllers/dev")
const jwt = require('../helpers/jwt')

Route
    .get("/apple-review", dev.appleReview)


module.exports = Route