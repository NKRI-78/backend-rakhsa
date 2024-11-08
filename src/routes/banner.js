const express = require("express")
const Route = express.Router()
const banner = require("../controllers/banner")
// const jwt = require('../helpers/jwt')

Route
    .get("/", banner.all)
    .post("/", banner.createOrUpdate)
    .post("/detail", banner.detail)
    .post("/delete", banner.delete)

module.exports = Route