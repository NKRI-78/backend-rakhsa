const express = require("express")
const Route = express.Router()

const admin = require("../controllers/admin")
const administration = require("../controllers/administration")

Route
    .post("/confirm", admin)
    .post("/continents", administration.continents)

    module.exports = Route