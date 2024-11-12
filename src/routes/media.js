const express = require("express")
const Route = express.Router()
const media = require("../controllers/media")

Route
	.post("/", media.upload)

module.exports = Route