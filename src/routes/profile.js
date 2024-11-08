const express = require("express")
const Route = express.Router()
const profile = require("../controllers/profile")
const jwt = require('../helpers/jwt')

Route
    .post("/", jwt, profile.self)
    .post("/update", jwt, profile.update)
    .get("/get-users/:username", jwt, profile.getUsers)
    .get("/generate-province-city", profile.generateProvinceCity)

module.exports = Route