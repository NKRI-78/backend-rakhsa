const express = require("express")
const Route = express.Router()
const kbri = require("../controllers/kbri")

Route
    .get("/info-kbri/:id", kbri.infoKbri)
    .post("/form-kbri", kbri.formKbri)

module.exports = Route