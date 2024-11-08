const express = require("express")
const Route = express.Router()
const job = require("../controllers/job")
const jwt = require('../helpers/jwt')

Route
    .get("/", job.all)
    .post("/", jwt, job.createOrUpdate)
    .post("/detail", jwt, job.detail)
    .post("/delete", jwt, job.delete)

module.exports = Route