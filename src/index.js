const express = require("express")

const auth = require("./routes/auth")
const administration = require("./routes/administration")
const chat = require("./routes/chat")

const Route = express.Router()

Route
    .use("/api/v1/auth", auth)
    .use("/api/v1/administration", administration)
    .use("/api/v1/chat", chat)

module.exports = Route