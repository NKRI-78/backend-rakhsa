const express = require("express")
const Route = express.Router()
const sos = require("../controllers/sos")

Route
    .get("/", sos.list)
    .get("/:id", sos.detail)
    .post("/rating", sos.ratingSos)
    .post("/close", sos.closeSos)
    .post("/expire", sos.expireSos)

module.exports = Route