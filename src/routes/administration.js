const express = require("express")
const Route = express.Router()
const administration = require("../controllers/administration")

Route
    .post("/provinces", administration.provinces)
    .post("/provinces-fspmi", administration.provincesFSPMI)
    .post("/provinces-cities", administration.citiesFSPMI)
    .post("/cities", administration.cities)
    .post("/districts", administration.districts)
    .post("/subdistricts", administration.subdistricts)
    .post("/postal-codes", administration.postalCodes)
    .post("/postal-codes/v2", administration.postalCodesV2)

module.exports = Route