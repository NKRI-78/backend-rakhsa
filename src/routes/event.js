const express = require("express")
const Route = express.Router()
const event = require("../controllers/event")
const jwt = require('../helpers/jwt')

Route
    .post("/", event.all)
    .post("/get-event-saka", event.getEventSaka)
    .post("/get-event-saka-join", event.getEventJoinSaka)
    .post("/assign", event.createOrUpdate)
    .post("/join", event.join)
    .post("/detail", event.detail)
    .post("/delete", event.delete)

module.exports = Route