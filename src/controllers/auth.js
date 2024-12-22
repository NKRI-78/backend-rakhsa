const { v4: uuidv4 } = require('uuid')

const Auth = require("../models/Auth")
const User = require("../models/User")

const jwt = require('jsonwebtoken')

const misc = require("../helpers/response")
const utils = require("../helpers/utils")
const Role = require('../models/Role')

const { generateOTP } = require('../configs/otp')

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

            if (login[0].enabled == 0) {
                var otp = generateOTP()
                await Promise.race([
                    Auth.updateOtp(otp, login[0].email),
                    utils.sendEmail(login[0].email, otp)
                ])
            }

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

            if(typeof req.body.phone == "undefined" || req.body.phone == "")
                throw new Error("Field phone is required")

            if(typeof req.body.emergency_contact == "undefined" || req.body.emergency_contact == "")
                throw new Error("Field emergency_contact is required")

            if(typeof req.body.password == "undefined" || req.body.password == "")
                throw new Error("Field password is required")

            var roles = await Role.findById(3)

            if(roles.length == 0)
                throw new Error("Role not found")

            var otp = generateOTP()

            var passwordHash = await utils.encryptPassword(req.body.password)

            var users = await Auth.checkEmail(req.body.email)

            if(users.length != 0)
                throw new Error("User already exist")

            await Auth.registerMember(
                userId,
                otp,
                req.body.email,
                req.body.phone,
                passwordHash
            )

            await User.registerMember(
                userId,
                req.body.fullname,
                req.body.passport,
                req.body.emergency_contact
            )

            await Role.insertUserRole(
                userId,
                3
            )

            await utils.sendEmail(
                req.body.email, 
                otp
            )

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

    registerAmulet: async (req, res) => {
        const { no_ktp, fullname, address, no_hp, email, password  } = req.body

        try {

            if(typeof no_ktp == "undefined" || no_ktp == "")
                throw new Error("Field no_ktp is required")

            if(typeof fullname == "undefined" || fullname == "")
                throw new Error("Field fullname is required")

            if(typeof address == "undefined" || address == "")
                throw new Error("Field address is required")

            if(typeof no_hp == "undefined" || no_hp == "")
                throw new Error("Field no_hp is required")

            if(typeof email == "undefined" || email == "")
                throw new Error("Field email is required")

            if(typeof password == "undefined" || password == "")
                throw new Error("Field password is required")

            var roles = await Role.findById(3)

            if(roles.length == 0)
                throw new Error("Role not found")

            var userId = uuidv4()

            var passwordHash = await utils.encryptPassword(password)

            var checkUser = await Auth.checkEmail(email)

            if(checkUser.length != 0)
                throw new Error("User already exist")

            await Auth.registerAmulet(
                userId,
                email, 
                no_hp, 
                passwordHash
            )

            await User.registerAmulet(
                userId,
                fullname,
                address 
            )

            await Role.insertUserRole(
                userId,
                3
            )

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
                    name:fullname,
                    email: email,
                    phone: no_hp,
                    role: role.name,
                    enabled: true,
                }
            })

        } catch(e) {    
            console.log(e)
            misc.response(res, 400, true, e.message)
        }
    },

    verifyOtp: async (req, res) => {
        const { email, otp } = req.body

        try {

            if (typeof email == "undefined" || email == "")
                throw new Error("Field email is required")

            if (typeof otp == "undefined" || otp == "")
                throw new Error("Field otp is required")

            if (!utils.validateEmail(email))
                throw new Error("Invalid format E-mail Address. Etc : johndoe@gmail.com")

            var checkEmail = await Auth.checkEmail(email)

            var isEmailAlreadyActive = await Auth.isEmailAlreadyActive(email)

            if (isEmailAlreadyActive.length != 0)
                throw new Error("E-mail Address sudah aktif")

            if (checkEmail.length != 0) {

                var checkOtpIsValid = await Auth.checkOtp(email, otp)

                if (checkOtpIsValid.length == 0)
                    throw new Error("OTP is invalid")

                var currentDate = new Date()
                var otpCreated = checkOtpIsValid[0].created_at
                var diff = new Date(currentDate.getTime() - otpCreated.getTime())
                if (diff.getMinutes() > 1) {
                    throw new Error("OTP is expired")
                } else {
                    await Auth.verifyOtp(email)

                    var payload = {
                        uid: checkOtpIsValid[0].uid,
                        authorized: true
                    }

                    var token = jwt.sign(payload, process.env.SECRET_KEY)
                    var refreshToken = jwt.sign(payload, process.env.SECRET_KEY)

                    misc.response(res, 200, false, "", {
                        token: token,
                        refresh_token: refreshToken,
                        user: {
                            id: checkOtpIsValid[0].user_id,
                            name: checkOtpIsValid[0].fullname,
                            email: email,
                            phone: checkOtpIsValid[0].phone,
                            role: checkOtpIsValid[0].role,
                            enabled: true,
                        }
                    })
                }

            } else {
                throw new Error("User not found")
            }
        } catch (e) {
            console.log(e)
            misc.response(res, 400, true, e.message)
        }
    },

    resendOtp: async (req, res) => {
        const { email } = req.body

        var otp = generateOTP()

        try {
            if (typeof email == "undefined" || email == "")
                throw new Error("Field email is required")

            if (!utils.validateEmail(email))
                throw new Error("Invalid format E-mail Address. Etc : johndoe@gmail.com")

            var isEmailAlreadyActive = await Auth.isEmailAlreadyActive(email)

            if (isEmailAlreadyActive.length != 0)
                throw new Error("E-mail Address is already active")

            var checkEmail = await Auth.checkEmail(email)
            if (checkEmail.length == 0)
                throw new Error(`User not found`)

            await Auth.resendOtp(email, otp)

            await utils.sendEmail(email, otp)

            misc.response(res, 200, false, `Berhasil mengirim ulang OTP, mohon periksa Alamat E-mail ${email}`)
        } catch (e) {
            console.log(e)
            misc.response(res, 400, true, e.message)
        }
    },

    registerKbri: async (_, res) => {
        try {

            misc.response(res, 200, false, "")

        } catch (e) {
            console.log(e)
            misc.response(res, 400, true, e.message)
        }
    },

    IsLoggedIn: async (req, res) => {
        const { user_id, type } = req.body

        try {

            if(typeof user_id == "undefined" || user_id == "")
                throw new Error("Field user_id is required")

            if(typeof type == "undefined" || type == "")
                throw new Error("Field type is required")

            await Auth.updateIsLoggedIn(user_id, type)

            misc.response(res, 200, false, "")
        } catch(e) {
            console.log(e)
            misc.response(res, 400, true, e.message)
        }
    },  

}