const express = require("express")
const Route = express.Router()
const payment = require("../controllers/payment")
const jwt = require("../helpers/jwt")

Route
    .get("/", jwt, payment.channel)
    .get("/channel2", jwt, payment.channelV2)
    .post("/inquiry", jwt, payment.inquiry)

module.exports = Route