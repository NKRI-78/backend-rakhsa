const express = require("express")
const Route = express.Router()
const event = require("../controllers/event")

Route
    .get("/", event.list)
    .get("/:id", event.detail)
    .post("/list-event-user", event.listEventUser)
    .post("/", event.store)
    .delete("/:id", event.delete)
    .put("/:id", event.update)

module.exports = Route