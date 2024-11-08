const express = require("express")
const Route = express.Router()
const store = require("../controllers/store")

const jwt = require('../helpers/jwt')

Route
    .post("/", jwt, store.createOrUpdate)
    .post("/detail", jwt, store.getStoreInfo)
    .get("/list", jwt, store.getAllStore)

module.exports = Route