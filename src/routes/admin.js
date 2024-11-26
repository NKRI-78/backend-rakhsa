const express = require("express")
const Route = express.Router()

const admin = require("../controllers/admin")

Route
    .get("/list/user", admin.listUser)
    .post("/create-user", admin.createUser)

module.exports = Route