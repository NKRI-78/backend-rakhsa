const express = require("express")
const Route = express.Router()
const sos = require("../controllers/sos")

Route
    .get("/", sos.list)
    .get("/:id", sos.detail)
    .post("/all-badge", sos.allBadge)
    .post("/rating", sos.ratingSos)
    .post("/confirm", sos.confirmSos)
    .post("/close", sos.closeSos)
    .post("/check-already-confirmed", sos.checkAlreadyConfirmed)
    .post("/move-to-recently", sos.moveSosToRecently)
    .post("/expire", sos.expireSos)

module.exports = Route