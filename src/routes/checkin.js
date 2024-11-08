const express = require("express")
const Route = express.Router()
const checkin = require("../controllers/checkin")
const jwt = require('../helpers/jwt')

Route
    .post("/all", jwt, checkin.all)
    .post("/assign", jwt, checkin.createOrUpdate)
    .post("/detail", jwt, checkin.detail)
    .post("/join", jwt, checkin.join)
    .post("/delete", jwt, checkin.delete)

module.exports = Route