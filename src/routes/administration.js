const express = require("express")
const Route = express.Router()
const administration = require("../controllers/administration")

Route
    .post("/continents", administration.continents)
    .post("/states", administration.states)
    .post("/cities", administration.cities)

module.exports = Route