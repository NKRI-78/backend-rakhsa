const express = require("express")
const Route = express.Router()
const organization = require("../controllers/organization")
const jwt = require('../helpers/jwt')

Route
    .get("/", organization.all)
    .post("/detail", organization.detail)
    .post("/", jwt, organization.createOrUpdate)
    .post("/data-leaders", jwt, organization.createOrUpdateDataLeaders)
    .post("/data-educators", jwt, organization.createOrUpdateDataEducators)
    .post("/data-trainnings", jwt, organization.createOrUpdateDataTrainnings)
    .post("/data-enterpreneurs", jwt, organization.createOrUpdateDataEnterpreneurs)
    .post("/delete", jwt, organization.delete)

module.exports = Route