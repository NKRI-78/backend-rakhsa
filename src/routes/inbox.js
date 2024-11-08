const express = require("express")
const Route = express.Router()
const inbox = require("../controllers/inbox")
const jwt = require('../helpers/jwt')

Route
    .post("/", jwt, inbox.all)
    .post("/assign", jwt, inbox.createOrUpdate)
    .post("/badges", jwt, inbox.badges)
    .post("/detail", jwt, inbox.detail)
    .post("/delete", jwt, inbox.delete)

module.exports = Route