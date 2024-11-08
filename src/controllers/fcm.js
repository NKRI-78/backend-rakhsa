const misc = require('../helpers/response')
const User = require('../models/User')
const Fcm = require('../models/Fcm')
const Inbox = require('../models/Inbox')
const utils = require('../helpers/utils')

const { v4: uuidv4 } = require('uuid')

module.exports = {

    init: async (req, res) => {
        const { token, lat, lng, user_id } = req.body

        try {

            if (typeof token == "undefined" || token == "")
                throw new Error("token wajib diisi")

            if (typeof lat == "undefined" || lat == "")
                throw new Error("lat wajib diisi")

            if (typeof lng == "undefined" || lng == "")
                throw new Error("lng wajib diisi")

            if (typeof user_id == "undefined" || user_id == "")
                throw new Error("user_id wajib diisi")

            var checkUsers = await User.checkUsers(user_id)
            if (checkUsers.length == 0)
                throw new Error("Pengguna tidak ditemukan")

            await Fcm.init(token, lat, lng, user_id)

            misc.response(res, 200, false, "")
        } catch (e) {
            console.log(e)
            misc.response(res, 400, false, e.message)
        }
    },

    broadcast: async (req, res) => {
        const { title, message } = req.body

        try {

            if (typeof title == "undefined" || title == "")
                throw new Error("title wajib diisi")

            if (typeof message == "undefined" || message == "")
                throw new Error("message wajib diisi")

            var users = await Fcm.users()

            await Inbox.createHistoryBroadcast(title, message, JSON.stringify({ user_id: req.decoded.uid }));

            for (i in users) {
                var user = users[i]

                var newsId = uuidv4()
 
                await Inbox.createOrUpdate(newsId, title, "-", message, "-", user.uid, "default")

                await utils.sendFCM(title, message, user.token, 'broadcast', newsId, '-')
            }

            misc.response(res, 200, false, "")
        } catch (e) {
            console.log(e)
            misc.response(res, 400, false, e.message)
        }
    },

    broadcastList: async (req, res) => {


        try {

            var inboxs = await Inbox.listInbox()

            misc.response(res, 200, false, inboxs)
        } catch (e) {
            console.log(e)
            misc.response(res, 400, false, e.message)
        }
    }


}