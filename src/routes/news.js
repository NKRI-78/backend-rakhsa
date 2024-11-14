const express = require("express")
const Route = express.Router()
const profile = require("../controllers/profile")
const news = require("../controllers/news")

Route
    .get("/", news.list)
    .get("/:id", news.find)
    .delete("/:id", news.delete)
    .post("/", news.insert)

module.exports = Route