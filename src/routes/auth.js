const express = require("express")
const Route = express.Router()
const auth = require("../controllers/auth")

Route
    .post("/login", auth.login)
    .post("/register-member", auth.registerMember)
    .post("/register-kbri", auth.registerKbri)

module.exports = Route