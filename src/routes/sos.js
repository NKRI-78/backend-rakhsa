const express = require("express")
const Route = express.Router()
const sos = require("../controllers/sos")
const jwt = require('../helpers/jwt')

Route
    .post("/", jwt, sos.sos)

module.exports = Route