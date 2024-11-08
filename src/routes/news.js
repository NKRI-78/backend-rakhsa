const express = require("express")
const Route = express.Router()
const news = require("../controllers/news")
// const jwt = require('../helpers/jwt')

Route
    .get("/", news.all)
    .post("/", news.createOrUpdate)
    .post("/detail", news.detail)
    .post("/delete", news.delete)

module.exports = Route