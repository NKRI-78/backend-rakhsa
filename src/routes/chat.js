const express = require("express")
const Route = express.Router()
const chat = require("../controllers/chat")

Route
    .post("/list", chat.list)
    .post("/messages", chat.messages)
    .post("/insert-message", chat.insertMessage)

module.exports = Route