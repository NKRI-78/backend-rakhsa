const express = require("express")

const administration = require("./routes/administration")
const Route = express.Router()

Route
    .use("/api/v1/administration", administration)

module.exports = Route