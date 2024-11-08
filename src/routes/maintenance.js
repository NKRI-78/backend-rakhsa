const express = require("express")
const Route = express.Router()
const maintenance = require("../controllers/maintenance")

Route
    .get("/", maintenance.maintenance)
    .get("/show-demo", maintenance.showDemo)

module.exports = Route