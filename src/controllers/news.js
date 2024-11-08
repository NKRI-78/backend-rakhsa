const misc = require("../helpers/response")
const escapeQoute = require('escape-quotes')
const News = require("../models/News")
const utils = require("../helpers/utils")
const Fcm = require("../models/Fcm")

module.exports = {

    all: async (_, res) => {
        try {   
            var news = await News.all()

            var data = []

            for (var i in news) {
                data.push({
                    id: news[i].uid,
                    title: news[i].title,
                    image: news[i].image,
                    desc: news[i].description,
                    created_at: utils.formatDate(news[i].created_at)
                })
            }

            misc.response(res, 200, false, "", data)
        } catch(e) {
            console.log(e)
            misc.response(res, 400, true, "Server error")
        }
    },


    detail: async (req, res) => {
        const { id } = req.body 
        
        try {

            var news = await News.detail(id)

            if(news.length == 0) 
                throw new Error("News not found")

            var data = []

            for (var i in news) {
                data.push({
                    id: news[i].uid,
                    title: news[i].title,
                    image: news[i].image,
                    desc: news[i].description,
                    created_at: utils.formatDate(news[i].created_at)
                })
            }

            misc.response(res, 200, false, "", data[0])
        } catch(e) {
            console.log(e)
            misc.response(res, 400, true, e.message)
        }
    },

    createOrUpdate: async (req, res) => {
        const { id, title, desc, image } = req.body
        
        try {

            if(typeof title == "undefined" || title == "")
                throw new Error("title is required")

            if(typeof desc == "undefined" || desc == "")
                throw new Error("desc is required")

            if(typeof image == "undefined" || image == "")
                throw new Error("image is required")

            await News.createOrUpdate(
                id, escapeQoute(title), escapeQoute(desc), 
                image
            )

            var users = await Fcm.users()

            for (const i in users) {
                var user = users[i]

                await utils.sendFCM(title, utils.getExcerpt(utils.escapeHtml(desc), 20), user.token, 'news', id, '-')
            }

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
                throw new Error("id is required")

            var isNewsExist = await News.checkNews(id)
            
            if(isNewsExist.length == 0) 
                throw new Error("News not found")

            await News.delete(id)

            misc.response(res, 200, false, "")
        } catch(e) {
            console.log(e)
            misc.response(res, 400, true, e.message)
        }
    }
    
}