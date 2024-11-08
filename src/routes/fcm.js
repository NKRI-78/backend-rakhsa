const express = require("express")
const Route = express.Router()
const fcm = require("../controllers/fcm")
const jwt = require('../helpers/jwt')

Route
    .post("/", jwt, fcm.init)
    .post("/broadcast", jwt, fcm.broadcast)
    .get("/broadcast", fcm.broadcastList)

module.exports = Route