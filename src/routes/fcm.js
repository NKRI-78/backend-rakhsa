const express = require("express")
const Route = express.Router()
const fcm = require("../controllers/fcm")

Route
    .post("/", fcm.initFcm)

module.exports = Route