const express = require("express")
const Route = express.Router()
const sos = require("../controllers/sos")

Route
    .get("/", sos.list)
    .get("/:id", sos.detail)
    .post("/all-badge", sos.allBadge)
    .post("/rating", sos.ratingSos)
    .post("/check-already-confirmed", sos.checkAlreadyConfirmed)
    .post("/close", sos.closeSos)
    .post("/move-to-recently", sos.moveSosToRecently)
    .post("/expire", sos.expireSos)

module.exports = Route