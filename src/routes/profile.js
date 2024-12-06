const express = require("express")
const Route = express.Router()
const profile = require("../controllers/profile")

Route
    .post("/", profile.getProfile)
    .post("/profile/update", profile.updateProfile)
    .post("/address/update", profile.updateAddress)

module.exports = Route