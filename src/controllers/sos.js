require("dotenv").config()

const { v4: uuidv4 } = require('uuid')
const misc = require('../helpers/response')
const Inbox = require('../models/Inbox')
const axios = require('axios')
const utils = require("../helpers/utils")
const Fcm = require("../models/Fcm")
const User = require("../models/User")

module.exports = {

    sos: async (req, res) => {
        const {
            origin_lat, origin_lng,
            title, message,
            user_id
        } = req.body

        try {

            if (typeof title == "undefined" || title == "")
                throw new Error("title wajib diisi")

            if (typeof message == "undefined" || message == "")
                throw new Error("message wajib diisi")

            if (typeof origin_lat == "undefined" || origin_lat == "")
                throw new Error("origin_lat wajib diisi")

            if (typeof origin_lng == "undefined" || origin_lng == "")
                throw new Error("origin_lng wajib diisi")

            if (typeof user_id == "undefined" || user_id == "")
                throw new Error("user_id wajib diisi")

            var checkUsers = await User.checkUsers(user_id)
            if (checkUsers.length == 0)
                throw new Error("Pengguna tidak ditemukan")

            var userlatlng = await Fcm.userLatLng(user_id)

            for (var i in userlatlng) {

                var fullname = userlatlng[i].fullname
                var token = userlatlng[i].token
                var destLat = userlatlng[i].lat
                var destLng = userlatlng[i].lng
                var userId = userlatlng[i].user_id

                const url = `${process.env.GMAP_URL}?origin=${origin_lat},${origin_lng}&destination=${destLat},${destLng}&key=${process.env.GMAP_KEY}`

                const response = await axios.get(url)

                if (response.status == 200) {

                    var routes = response.data.routes

                    for (var i in routes) {

                        var sosId = uuidv4()

                        // 5 KM 
                        if (routes[i].legs[0].distance.value <= 5000) {
                            await Inbox.createOrUpdate(
                                sosId, title, '-', message, "-", userId, "sos", origin_lat, origin_lng,
                            )
                            await utils.sendFCM(
                                `${fullname} - (SOS)`,
                                message,
                                token,
                                'sos',
                                sosId,
                                '-'
                            )
                        }

                    }
                }
            }

            misc.response(res, 200, false, "")
        } catch (e) {
            console.log(e)
            misc.response(res, 400, true, e.message)
        }
    },

}
