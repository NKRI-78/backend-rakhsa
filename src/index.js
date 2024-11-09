const express = require("express")

const auth = require("./routes/auth")
const administration = require("./routes/administration")

const Route = express.Router()

Route
    .use("/api/v1/auth", auth)
    .use("/api/v1/administration", administration)

module.exports = Route