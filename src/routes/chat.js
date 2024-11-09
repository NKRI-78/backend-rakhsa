const express = require("express")
const Route = express.Router()
const chat = require("../controllers/chat")

Route
    .post("/", chat.chat)
    .post("/list", chat.chatList)
    .post("/messages", chat.messages)

module.exports = Route