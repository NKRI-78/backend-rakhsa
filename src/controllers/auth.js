const misc = require('../helpers/response')
const utils = require('../helpers/utils')
const jwt = require('jsonwebtoken')
const axios = require('axios')
const bcrypt = require('bcryptjs')
const Auth = require('../models/Auth')
const User = require('../models/User')
const Job = require('../models/Job')
const Organization = require('../models/Organization')

const { generateOTP } = require('../configs/otp')
const { v4: uuidv4 } = require('uuid')
const { validateEmail } = require('../helpers/utils')

module.exports = {

    login: async (req, res) => {
        const { email, password } = req.body

        try {

            if (typeof email == "undefined" || email == "")
                throw new Error("email wajib diisi")

            if (typeof password == "undefined" || password == "")
                throw new Error("password wajib diisi")

            var login = await Auth.login(email)

            if (login.length == 0)
                throw new Error("Pengguna tidak ditemukan")

            var user = login[0]

            if (user.email_activated == 0) {
                var otp = generateOTP()
                await Promise.race([
                    Auth.updateOtp(otp, user.email),
                    utils.sendEmail(user.email, otp)
                ])
            }

            var passwordHash = await utils.checkPasswordEncrypt(password, user.password)

            if (!passwordHash)
                throw new Error("password tidak sama")

            var payload = {
                uid: user.uid,
                authorized: true
            }

            var token = jwt.sign(payload, process.env.SECRET_KEY)
            var refreshToken = jwt.sign(payload, process.env.SECRET_KEY)

            var emailActivated = user.email_activated == 1 ? true : false
            var phoneActivated = user.phone_activated == 1 ? true : false

            misc.response(res, 200, false, "", {
                token: token,
                refresh_token: refreshToken,
                user: {
                    id: user.uid,
                    avatar: user.avatar ?? "",
                    name: user.fullname,
                    email: user.email,
                    email_activated: emailActivated,
                    phone: user.phone,
                    phone_activated: phoneActivated,
                    role: user.role,
                }
            })
        } catch (e) {
            console.log(e)
            misc.response(res, 400, true, e.message)
        }
    },

    register: async (req, res) => {
        var uid = uuidv4()

        const {
            fullname,
            email,
            password,
            phone,
            organization,
            job,
            referral
        } = req.body

        var payload = {
            uid: uid,
            authorized: true
        }

        var token = jwt.sign(payload, process.env.SECRET_KEY)
        var refreshToken = jwt.sign(payload, process.env.SECRET_KEY)

        try {

            if (typeof fullname == "undefined" || fullname == "")
                throw new Error("fullname wajib diisi")

            if (typeof email == "undefined" || email == "")
                throw new Error("email wajib diisi")

            if (typeof phone == "undefined" || phone == "")
                throw new Error("phone wajib diisi")

            if (typeof password == "undefined" || password == "")
                throw new Error("password wajib diisi")

            var checkMail = await Auth.checkEmail(email)
            if (checkMail.length != 0)
                throw new Error(`Pengguna ${checkMail[0].email} sudah ada`)

            var checkPhone = await Auth.checkPhone(phone)
            if (checkPhone.length != 0)
                throw new Error(`Nomor Ponsel ${checkPhone[0].phone} sudah ada`)

            var isJobExist = await Job.checkJobs(job)
            if (isJobExist.length == 0)
                throw new Error("Profesi tidak ditemukan")

            var isOrganizationExist = await Organization.checkOrganizations(organization)
            if (isOrganizationExist.length == 0)
                throw new Error("Organisasi tidak ditemukan")

            var otp = generateOTP()

            var passwordHash = await utils.encryptPassword(password)

            await utils.sendEmail(email, otp)

            await Auth.register(uid, otp, phone, email, passwordHash, referral)

            await User.insert(uid, fullname)

            await Job.createUserJobs(uid, job)

            await Organization.createUserOrganizations(uid, organization)

            misc.response(res, 200, false, "", {
                token: token,
                refresh_token: refreshToken,
                user: {
                    id: uid,
                    name: fullname,
                    email: email,
                    email_activated: false,
                    phone: phone,
                    phone_activated: false,
                    role: "user",
                }
            })
        } catch (e) {
            console.log(e)
            misc.response(res, 400, true, e.message)
        }
    },

    registerv2: async (req, res) => {
        var uid = uuidv4()

        const { name, phone, email, address, id_number } = req.body

        try {

            await Auth.registerv2(uid, phone, email)

            await User.insertv2(uid, name, address, id_number)

            misc.response(res, 200, false, "")
        } catch (e) {
            console.log(e)
            misc.response(res, 400, true, "Internal Server Error")
        }
    },

    activeToggle: async (req, res) => {
        const { user_id } = req.body

        try {

            var checkIsActive = await Auth.checkIsActive(user_id)
            if (checkIsActive.length == 0)
                throw new Error("Pengguna tidak ditemukan")

            if (checkIsActive[0].status == "enabled")
                await Auth.activeToggle(user_id, "disabled")
            else
                await Auth.activeToggle(user_id, "enabled")

            misc.response(res, 200, false, "")
        } catch (e) {
            console.log(e)
            misc.response(res, 400, true, e.message)
        }
    },

    delete: async (req, res) => {
        const { user_id } = req.body

        try {

            if (typeof user_id == "undefined" || user_id == "")
                throw new Error("user_id wajib diisi")

            await Auth.delete(user_id)
            await Auth.deleteProfile(user_id)

            await axios.delete(`https://api-forum-general.inovatiftujuh8.com/forums/v1/delete-member`, {
                user_id: user_id,
                app_name: "hp3ki",
            })

            misc.response(res, 200, false, "")
        } catch (e) {
            console.log(e)
            misc.response(res, 400, true, e.message)
        }
    },

    socialMedia: async (req, res) => {
        const { email } = req.body

        try {

            if (typeof email == "undefined" || email == "")
                throw new Error("email wajib diisi")

            if (!validateEmail(email))
                throw new Error("Invalid format E-mail Address. Etc : johndoe@gmail.com")

            var login = await Auth.login(email)
            if (login.length == 0)
                throw new Error("Pengguna tidak ditemukan")

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
                    email_activated: login[0].email_activated == 1 ? true : false,
                    phone: login[0].phone,
                    phone_activated: login[0].phone_activated == 1 ? true : false,
                    role: login[0].role,
                }
            })
        } catch (e) {
            console.log(e)
            misc.response(res, 400, true, e.message)
        }
    },

    verifyOtp: async (req, res) => {
        const { email, otp } = req.body

        try {

            if (typeof email == "undefined" || email == "")
                throw new Error("email wajib diisi")

            if (typeof otp == "undefined" || otp == "")
                throw new Error("otp wajib diisi")

            if (!validateEmail(email))
                throw new Error("Invalid format E-mail Address. Etc : johndoe@gmail.com")

            var checkEmail = await Auth.checkEmail(email)

            var isEmailAlreadyActive = await Auth.isEmailAlreadyActive(email)

            if (isEmailAlreadyActive.length != 0)
                throw new Error("E-mail Address sudah aktif")

            if (checkEmail.length != 0) {

                var checkOtpIsValid = await Auth.checkOtp(email, otp)

                if (checkOtpIsValid.length == 0)
                    throw new Error("OTP salah")

                var currentDate = new Date()
                var otpCreated = checkOtpIsValid[0].created_at
                var diff = new Date(currentDate.getTime() - otpCreated.getTime())
                if (diff.getMinutes() > 1) {
                    misc.response(res, 400, false, "OTP kadaluwarsa")
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
                            id: checkOtpIsValid[0].uid,
                            name: checkOtpIsValid[0].fullname,
                            email: checkOtpIsValid[0].email,
                            email_activated: true,
                            phone: checkOtpIsValid[0].phone,
                            phone_activated: true,
                            role: "user",
                        }
                    })
                }

            } else {
                misc.response(res, 400, false, "Pengguna tidak ditemukan")
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
                throw new Error("email wajib diisi")

            if (!validateEmail(email))
                throw new Error("Invalid format E-mail Address. Etc : johndoe@gmail.com")

            var isEmailAlreadyActive = await Auth.isEmailAlreadyActive(email)

            if (isEmailAlreadyActive.length != 0)
                throw new Error("Alamat E-mail sudah aktif")

            var checkEmail = await Auth.checkEmail(email)
            if (checkEmail.length == 0)
                throw new Error(`Pengguna ${email} tidak ditemukan`)

            await Auth.resendOtp(email, otp)

            await utils.sendEmail(email, otp)

            misc.response(res, 200, false, `Berhasil mengirim ulang OTP, mohon periksa Alamat E-mail ${email}`)
        } catch (e) {
            console.log(e)
            misc.response(res, 400, true, e.message)
        }
    },

    changePassword: async (req, res) => {
        const { email, old_password, new_password } = req.body

        try {

            if (typeof email == "undefined" || email == "")
                throw new Error("email wajib diisi")

            if (typeof old_password == "undefined" || old_password == "")
                throw new Error("old_password wajib diisi")

            if (typeof new_password == "undefined" || new_password == "")
                throw new Error("new_password wajib diisi")

            if (!validateEmail(email))
                throw new Error("Invalid format E-mail Address. Etc : johndoe@gmail.com")

            var checkEmail = await Auth.checkEmail(email)

            if (checkEmail.length == 0)
                throw new Error('Pengguna tidak ditemukan')

            var isMatch = await bcrypt.compare(old_password, checkEmail[0].password)

            if (!isMatch)
                throw new Error('Kata Sandi lama tidak sama')

            var passwordHash = await utils.encryptPassword(new_password)

            await Auth.changePassword(email, passwordHash)

            misc.response(res, 200, false, 'Berhasil, kata sandi Anda berhasil diubah')
        } catch (e) {
            console.log(e)
            misc.response(res, 400, true, e.message)
        }
    },

    forgotPassword: async (req, res) => {
        const { email } = req.body

        try {
            if (typeof email == "undefined" || email == "")
                throw new Error("email wajib diisi")

            if (!validateEmail(email))
                throw new Error("Invalid format E-mail Address. Etc : johndoe@gmail.com")

            var password = utils.makeid(8)

            var checkEmail = await Auth.checkEmail(email)
            if (checkEmail.length == 0)
                throw new Error("Pengguna tidak ditemukan")

            await axios.post(
                process.env.NOTIFICATION_SERVICE, {
                to: email,
                app: "HP3KI",
                subject: "Verifikasi Kode",
                body: `<div style="font-family: Helvetica,Arial,sans-serif; min-width:1000px; overflow:auto; line-height:2"><div style="margin:50px auto; width:70%; padding: 20px 0;">Gunakan kode ini untuk verifikasi kata sandi baru<h2 style="background: #00466a; margin: 0 auto; width: max-content; padding: 0 10px; color: #fff; border-radius: 4px;">`+ password + `</h2></div></div>`
            })

            var passwordHash = await utils.encryptPassword(password)

            await Auth.changePassword(email, passwordHash)

            misc.response(res, 200, false, `Berhasil, mohon periksa Alamat E-mail ${email} untuk mendapatkan kata sandi baru`)
        } catch (e) {
            console.log(e)
            misc.response(res, 400, true, e.message)
        }
    },

    updateEmail: async (req, res) => {
        const { old_email, new_email } = req.body

        var otp = generateOTP()

        try {

            if (typeof old_email == "undefined" || old_email == "")
                throw new Error("old_email wajib diisi")

            if (typeof new_email == "undefined" || new_email == "")
                throw new Error("new_email wajib diisi")

            if (!validateEmail(new_email))
                throw new Error("Invalid format E-mail Address. Etc : johndoe@gmail.com")

            var oldCheckEmail = await Auth.checkEmail(old_email)
            if (oldCheckEmail.length == 0)
                throw new Error("Pengguna tidak ditemukan")

            var newCheckEmail = await Auth.checkEmail(new_email)
            if (newCheckEmail.length != 0)
                throw new Error(`Alamat E-mail ${checknewCheckEmailEmail[0].email} sudah terdaftar`)

            await Auth.updateEmailOtp(old_email, new_email)

            await Auth.insertOtp(new_email, otp)

            await utils.sendEmail(new_email, otp)

            misc.response(res, 200, false, `Berhasil, Alamat E-mail ${new_email} telah berubah`)
        } catch (e) {
            console.log(e)
            misc.response(res, 400, true, e.message)
        }
    },
}