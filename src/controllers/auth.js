const { v4: uuidv4 } = require('uuid')

const Auth = require("../models/Auth")
const User = require("../models/User")

const jwt = require('jsonwebtoken')

const misc = require("../helpers/response")
const utils = require("../helpers/utils")
const Role = require('../models/Role')

module.exports = {

    login: async (req, res) => {
        try {

            if(typeof req.body.value == "undefined" || req.body.value == "")
                throw new Error("Field value is required")

            if(typeof req.body.password == "undefined" || req.body.password == "")
                throw new Error("Field password is required")

            var login = await Auth.login(req.body.value)

            if(login.length == 0)
                throw new Error("User not found")

            var passwordDb = login[0].password 

            var isPasswordMatch = await utils.checkPasswordEncrypt(req.body.password, passwordDb)

            if(!isPasswordMatch)
                throw new Error("Credentials invalid")

            var payload = {
                uid: login[0].uid,
                authorized: true
            }

            var token = jwt.sign(payload, process.env.SECRET_KEY)
            var refreshToken = jwt.sign(payload, process.env.SECRET_KEY)

            misc.response(res, 200, false, "", {
                token: token,
                refresh_token: refreshToken,
                user: {
                    id: login[0].uid,
                    name: login[0].fullname,
                    email: login[0].email,
                    phone: login[0].phone,
                    role: login[0].role,
                    enabled: login[0].enabled == 1 
                    ? true 
                    : false
                }
            })

        } catch (e) {
            console.log(e)
            misc.response(res, 400, true, e.message)
        }
    },

    registerMember: async (req, res) => {
        try {

            var userId = uuidv4()

            if(typeof req.body.fullname == "undefined" || req.body.fullname == "")
                throw new Error("Field fullname is required")

            if(typeof req.body.email == "undefined" || req.body.email == "")
                throw new Error("Field email is required")

            if(typeof req.body.passport == "undefined" || req.body.passport == "")
                throw new Error("Field passport is required")

            if(typeof req.body.emergency_contact == "undefined" || req.body.emergency_contact == "")
                throw new Error("Field emergency_contact is required")

            if(typeof req.body.password == "undefined" || req.body.password == "")
                throw new Error("Field password is required")

            await Auth.registerMember(
                userId,
                req.body.email,
                req.body.password
            )

            await User.registerMember(
                userId,
                req.body.fullname,
                req.body.passport,
                req.body.emergency_contact
            )

            var roles = await Role.findById(3)

            if(roles.length == 0)
                throw new Error("Role not found")

            var role = roles[0]

            var payload = {
                uid: userId,
                authorized: true
            }

            var token = jwt.sign(payload, process.env.SECRET_KEY)
            var refreshToken = jwt.sign(payload, process.env.SECRET_KEY)

            misc.response(res, 200, false, "", {
                token: token,
                refresh_token: refreshToken,
                user: {
                    id: userId,
                    name: req.body.fullname,
                    email: req.body.email,
                    phone: req.body.phone,
                    role: role.name,
                    enabled: false,
                }
            })

        } catch (e) {
            console.log(e)
            misc.response(res, 400, true, e.message)
        }
    },

    registerKbri: async (req, res) => {
        try {

            misc.response(res, 200, false, "")

        } catch (e) {
            console.log(e)
            misc.response(res, 400, true, e.message)
        }
    },

}