const express = require("express")
const Route = express.Router()
const auth = require("../controllers/auth")

Route
    .post("/login", auth.login)
    .post("/register-member", auth.registerMember)
    .post("/register-amulet", auth.registerAmulet)
    .post("/register-kbri", auth.registerKbri)
    .post("/verify-otp", auth.verifyOtp)
    .post("/resend-otp", auth.resendOtp)

module.exports = Route