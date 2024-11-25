const express = require("express")
const Route = express.Router()
const kbri = require("../controllers/kbri")

Route
    .get("/:id", kbri.infoKbri)
    .post("/", kbri.formKbri)

module.exports = Route