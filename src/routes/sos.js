const express = require("express")
const Route = express.Router()
const sos = require("../controllers/sos")

Route
    .get("/", sos.list)

module.exports = Route