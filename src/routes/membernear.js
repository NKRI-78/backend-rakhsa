const express = require("express")
const Route = express.Router()
const membernear = require("../controllers/membernear")
// const jwt = require('../helpers/jwt')

Route
	.post("/",  membernear.all)

module.exports = Route