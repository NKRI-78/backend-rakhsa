const { v4: uuidv4 } = require('uuid')
const escapeQoute = require('escape-quotes')
const misc = require('../helpers/response')
const User = require('../models/User')
const Inbox = require('../models/Inbox')
const utils = require('../helpers/utils')

module.exports = {

    all: async (req, res) => {
        const { user_id, type } = req.body

        var page = parseInt(req.query.page) || 1
        var limit = parseInt(req.query.limit) || 10

        var offset = (page - 1) * limit

        var checkType = type || 'default'

        try {

            if (typeof user_id == "undefined" || user_id == "")
                throw new Error("user_is wajib diisi")

            if (typeof type == "undefined" || type == "")
                throw new Error("type wajib diisi")

            var checkUsers = await User.checkUsers(user_id)
            if (checkUsers.length == 0)
                throw new Error("Pengguna tidak ditemukan")

            var badgesNotRead = await Inbox.badgesNotRead(user_id, checkType)

            var inboxes = await Inbox.all(offset, limit, checkType, user_id)
            var resultTotal = limit > 10 ? Math.ceil(inboxes.length / limit) : inboxes.length
            var perPage = Math.ceil(resultTotal / limit)
            var prevPage = page === 1 ? 1 : page - 1
            var nextPage = page === perPage ? 1 : page + 1

            var data = []

            for (var i in inboxes) {
                var inbox = inboxes[i]

                data.push({
                    id: inbox.uid,
                    title: inbox.title,
                    subject: inbox.subject,
                    description: inbox.description,
                    link: inbox.link,
                    user: {
                        name: inbox.name,
                        email: inbox.email
                    },
                    read: parseInt(inbox.isread) == 0
                        ? false
                        : true,
                    latitude: parseFloat(inbox.latitude ?? 0.0),
                    longitude: parseFloat(inbox.longitude ?? 0.0),
                    created_at: utils.formatDateWithSeconds(inbox.created_at),
                    updated_at: utils.formatDateWithSeconds(inbox.updated_at)
                })
            }

            const pageDetail = {
                badges: badgesNotRead.length,
                total: resultTotal,
                per_page: perPage,
                next_page: nextPage,
                prev_page: prevPage,
                current_page: page,
                next_url: `${process.env.BASE_URL}${req.originalUrl.replace("page=" + page, "page=" + nextPage)}`,
                prev_url: `${process.env.BASE_URL}${req.originalUrl.replace("page=" + page, "page=" + prevPage)}`
            }

            misc.responsePagination(res, 200, false, "", pageDetail, data)
        } catch (e) {
            console.log(e)
            misc.response(res, 400, true, e.message)
        }
    },

    createOrUpdate: async (req, res) => {
        const { title, subject, description, link, user_id, type } = req.body

        try {

            if (typeof title == "undefined" || title == "")
                throw new Error("title wajib diisi")

            if (typeof subject == "undefined" || subject == "")
                throw new Error("subject wajib diisi")

            if (typeof description == "undefined" || description == "")
                throw new Error("description wajib diisi")

            if (typeof link == "undefined" || link == "")
                throw new Error("link wajib diisi")

            if (typeof user_id == "undefined" || user_id == "")
                throw new Error("user_id wajib diisi")

            if (typeof type == "undefined" || type == "")
                throw new Error("type wajib diisi")

            var checkUsers = await User.checkUsers(user_id)
            if (checkUsers.length == 0)
                throw new Error("Pengguna tidak ditemukan")

            await Inbox.createOrUpdate(uuidv4(), escapeQoute(title), escapeQoute(subject), escapeQoute(description), link, user_id, type)

            misc.response(res, 200, false, "")
        } catch (e) {
            console.log(e)
            misc.response(res, 400, true, e.message)
        }
    },

    badges: async (req, res) => {
        const { user_id } = req.body

        try {

            if (typeof user_id == "undefined" || user_id == "")
                throw new Error("user_id wajib diisi")

            var checkUser = await User.checkUsers(user_id)
            if (checkUser.length == 0)
                throw new Error("Pengguna tidak ditemukan")

            var badges = await Inbox.badgesNotReadAll(user_id)

            var data = badges.length != 0
                ?
                {
                    total: badges.length
                }
                :
                {
                    total: 0
                }

            misc.response(res, 200, false, "", data)
        } catch (e) {
            console.log(e)
            misc.response(res, 400, true, e.message)
        }
    },

    detail: async (req, res) => {
        const { id } = req.body

        try {

            if (typeof id == "undefined" || id == "")
                throw new Error("id wajib diisi")

            var checkInboxes = await Inbox.checkInboxes(id)
            if (checkInboxes.length == 0)
                throw new Error("Inbox tidak ditemukan")

            await Inbox.updateInboxRead(id)

            var inboxes = await Inbox.detail(id)

            var data = []

            for (var i in inboxes) {
                var inbox = inboxes[i]

                data.push({
                    id: inbox.uid,
                    title: inbox.title,
                    subject: inbox.subject,
                    description: inbox.description,
                    link: inbox.link,
                    user: {
                        name: inbox.name,
                        email: inbox.email
                    },
                    read: parseInt(inbox.isread) == 0
                    ? false
                    : true,
                    lat: inbox.latitude, 
                    lng: inbox.longitude,
                    created_at: utils.formatDateWithSeconds(inbox.created_at),
                    updated_at: utils.formatDateWithSeconds(inbox.updated_at)
                })
            }

            misc.response(res, 200, false, "", data[0])
        } catch (e) {
            console.log(e)
            misc.response(res, 400, true, e.message)
        }
    },

    delete: async (req, res) => {
        const { id } = req.body

        try {

            if (typeof id == "undefined" || id == "")
                throw new Error("id wajib diisi")

            var checkInboxes = await Inbox.checkInboxes(id)
            if (checkInboxes.length == 0)
                throw new Error("Inbox tidak ditemukan")

            await Inbox.delete(id)

            misc.response(res, 200, false, "")
        } catch (e) {
            console.log(e)
            misc.response(res, 400, true, e.message)
        }
    }

}