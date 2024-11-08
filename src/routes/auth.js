const express = require("express")
const Route = express.Router()
const auth = require("../controllers/auth")

Route
    .post("/login", auth.login)
    .post("/register", auth.register)
    .post("/register-v2", auth.registerv2)
    .post("/active/toggle", auth.activeToggle)
    .post("/delete", auth.delete)
    .post("/verify-otp", auth.verifyOtp)
    .post("/social-media", auth.socialMedia)
    .post("/change-password", auth.changePassword)
    .post("/forgot-password", auth.forgotPassword)
    .post("/update-email", auth.updateEmail)
    .post("/resend-otp", auth.resendOtp)

module.exports = Route