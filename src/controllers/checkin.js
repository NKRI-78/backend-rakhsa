const escapeQoute = require('escape-quotes')
const moment = require("moment")
const misc = require('../helpers/response')
const Checkin = require('../models/Checkin')
const User = require('../models/User')

const { v4: uuidv4 } = require('uuid')
const utils = require('../helpers/utils')
const Fcm = require('../models/Fcm')

module.exports = {

    all: async (req, res) => {
        const { user_id } = req.body

        try {

            if(typeof user_id == "undefined" || user_id == "")
                throw new Error("user_id wajib diisi")

            var checkins = await Checkin.all()

            var data = []

            for(i in checkins)  {
                
                var checkin = checkins[i]

                var checkUserJoin = await Checkin.checkUserJoin(checkin.uid)

                var checkUserSelfJoin = await Checkin.checkSelfJoin(checkin.uid, user_id)

                var joined = []

                for(z in checkUserJoin) {
                    joined.push({
                        id: checkUserJoin[z].user_id,
                        avatar: checkUserJoin[z].avatar,
                        name: checkUserJoin[z].fullname
                    })
                }

                var is_pass = utils.hasDatePassed(checkin.checkin_date)

                data.push({
                    id: checkin.uid,
                    title: checkin.title,
                    desc: checkin.description,
                    location: checkin.location,
                    lat: checkin.lat, 
                    lng: checkin.lng,
                    start: checkin.start,
                    end: checkin.end,
                    joined: {
                        user: joined
                    },
                    is_pass: is_pass,
                    join: checkUserSelfJoin.length == 1 ? true : false,
                    checkin_date: utils.formatDate(checkin.checkin_date),
                    user: {
                        id: checkin.user_id,
                        avatar: checkin.avatar == null ? "" : checkin.avatar,
                        name: checkin.fullname
                    }
                })

            }

            misc.response(res, 200, false, "", data)
        } catch(e) {
            console.log(e)
            misc.response(res, 400, false, e.message)
        }
    },

    createOrUpdate: async (req, res) => {
        const { 
            title, desc, location, lat, lng, start, end, 
            user_id, checkin_date 
        } = req.body

        try {

            if(typeof title == "undefined" || title == "")
                throw new Error("title wajib diisi")

            if(typeof desc == "undefined" || desc == "")
                throw new Error("desc wajib diisi")

            if(typeof location == "undefined" || location == "")
                throw new Error("location wajib diisi")

            if(typeof lat == "undefined" || lat == "")
                throw new Error("lat wajib diisi")

            if(typeof lng == "undefined" || lng == "")
                throw new Error("lng wajib diisi")
            
            if(typeof start == "undefined" || start == "")
                throw new Error("start wajib diisi")

            if(typeof end == "undefined" || end == "")
                throw new Error("end wajib diisi")

            if(typeof user_id == "undefined" || user_id == "")
                throw new Error("user_id wajib diisi")

            if(typeof checkin_date == "undefined" || checkin_date == "")
                throw new Error("checkin_date wajib diisi")

            var checkUsers = await User.checkUsers(user_id)
            if(checkUsers.length == 0)
                throw new Error("Pengguna tidak ditemukan")

            var users = await Fcm.users()

            for (const i in users) {
                var user = users[i]

                await utils.sendFCM(
                    title, 
                    utils.getExcerpt(utils.escapeHtml(desc), 20), 
                    user.token, 'checkin', '-', '-'
                )
            }

            await Checkin.createOrUpdate(
                uuidv4(), escapeQoute(title), escapeQoute(desc), 
                escapeQoute(location), lat, lng,
                start, end, user_id, checkin_date   
            )

            misc.response(res, 200, false, "")
        } catch(e) {
            console.log(e)
            misc.response(res, 400, true, e.message)
        }
    },

    detail: async (req, res) => {
        const { checkin_id, user_id } = req.body

        try {

            if(typeof checkin_id == "undefined" || checkin_id == "")
                throw new Error("checkin_id wajib diisi")

            if(typeof user_id == "undefined" || user_id == "")
                throw new Error("user_id wajib diisi")

            var checkins = await Checkin.detail(checkin_id, user_id)
            if(checkins.length == 0)
                throw new Error("Detail Checkin tidak ditemukan")

            var data = []

            for(i in checkins)  {
                
                var checkin = checkins[i]

                var checkUserJoin = await Checkin.checkUserJoin(checkin.uid, user_id)

                data.push({
                    id: checkin.uid,
                    title: checkin.title,
                    desc: checkin.description,
                    location: checkin.location,
                    lat: checkin.lat, 
                    lng: checkin.lng,
                    start: checkin.start,
                    end: checkin.end,
                    join: checkUserJoin.length == 1 ? true : false,
                    checkin_date: utils.formatDate(checkin.checkin_date),
                    user: {
                        id: checkin.user_id,
                        avatar: checkin.avatar == null ? "" : checkin.avatar,
                        name: checkin.fullname
                    }
                })

            }

            misc.response(res, 200, false, "", data)
        } catch(e) {
            console.log(e) 
            misc.response(res, 400, true, e.message)
        }
    },

    join: async (req, res) => {
        const { checkin_id, user_id } = req.body 

        try {

            if(typeof checkin_id == "undefined" || checkin_id == "")
                throw new Error("checkin_id wajib diisi")

            if(typeof user_id == "undefined" || user_id == "")
                throw new Error("user_id wajib diisi")

            await Checkin.join(uuidv4(), checkin_id, user_id)

            misc.response(res, 200, false, "")
        } catch(e) {
            console.log(e)
            misc.response(res, 400, true, e.message)
        }
    },

    delete: async (req, res) => {
        const { id } = req.body

        try {
            
            if(typeof id == "undefined" || id == "")
                throw new Error("id wajib diisi")

            var checkCheckin = await Checkin.checkCheckin(id)
            
            if(checkCheckin.length == 0)
                throw new Error("Checkin tidak ditemukan")

            await Checkin.delete(id)

            misc.response(res, 200, false, "")
        } catch(e) {
            console.log(e)
            misc.response(res, 400, true, e.message)
        }
    }
}