const express = require("express")
const Route = express.Router()

const admin = require("../controllers/admin")

Route
    .get("/list/user", admin.listUser)
    .post("/assign/user/kbri", admin.assignUserKbri)
    .post("/create-user", admin.createUser)

module.exports = Route