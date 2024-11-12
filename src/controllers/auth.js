const Auth = require("../models/Auth")
const misc = require("../helpers/response")

const jwt = require('jsonwebtoken')

const utils = require("../helpers/utils")

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
                }
            })

        } catch (e) {
            console.log(e)
            misc.response(res, 400, true, e.message)
        }
    },

    registerMember: async (req, res) => {
        try {

            if(typeof req.body.fullname == "undefined" || req.body.fullname == "")
                throw new Error("Field fullname is required")

            if(typeof req.body.email == "undefined" || req.body.email == "")
                throw new Error("Field email is required")

            if(typeof req.body.passport == "undefined" || req.body.passport == "")
                throw new Error("Field passport is required")

            // if(typeof req.body.)

            if(typeof req.body.password == "undefined" || req.body.password == "")
                throw new Error("Field password is required")

            misc.response(res, 200, false, "")

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