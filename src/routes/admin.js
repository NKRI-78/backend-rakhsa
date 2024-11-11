const express = require("express")
const Route = express.Router()

const admin = require("../controllers/admin")

Route
    .post("/confirm", admin.confirmSos)

    module.exports = Route