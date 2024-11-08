const express = require("express")
const Route = express.Router()
const formOf = require("../controllers/form_of")
const organization = require("../controllers/organization")
const jwt = require('../helpers/jwt')

Route
    .post("/business", jwt, formOf.createOrUpdateBusiness)
    .get("/business", formOf.business)
    .post("/business/detail", jwt, formOf.businessDetail)
    .post("/business/delete", jwt, formOf.businessDelete)
    .get("/classification", formOf.classification)
    .post("/classification/detail", formOf.classificationDetail)
    .post("/classification", jwt, formOf.createOrUpdateClassification)
    .post("/classification/delete", jwt, formOf.classificationDelete)
    .post("/organization/delete", jwt, organization.delete)

module.exports = Route