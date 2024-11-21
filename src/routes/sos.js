const express = require("express")
const Route = express.Router()
const sos = require("../controllers/sos")

Route
    .get("/", sos.list)
    .get("/:id", sos.detail)
    .post("/expire", sos.expireSos)

module.exports = Route