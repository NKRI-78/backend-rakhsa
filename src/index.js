const express = require("express")

const auth = require("./routes/auth")
const administration = require("./routes/administration")
const chat = require("./routes/chat")
const profile = require("./routes/profile")
const sos = require("./routes/sos")
const media = require("./routes/media")
const news = require("./routes/news")
const event = require("./routes/event")
const admin = require("./routes/admin")

const Route = express.Router()

Route
    .use("/api/v1/auth", auth)
    .use("/api/v1/admin", admin)
    .use("/api/v1/administration", administration)
    .use("/api/v1/chat", chat)
    .use("/api/v1/event", event)
    .use("/api/v1/media", media)
    .use("/api/v1/news", news)
    .use("/api/v1/profile", profile)
    .use("/api/v1/sos", sos)

module.exports = Route