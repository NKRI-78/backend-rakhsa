const express = require("express")
const Route = express.Router()
const kbri = require("../controllers/kbri")

Route
    .get("/info-kbri/:id", kbri.infoKbri)
    .get("/info-visa", kbri.infoVisa)
    .get("/info-passport", kbri.infoPassport)
    .get("/info-kbri-state/:state_id", kbri.infoKbriState)
    .post("/form-kbri", kbri.formKbri)

module.exports = Route