require("dotenv").config()

const misc = require('../helpers/response')
const News = require("../models/News")

const { fdate } = require("../helpers/utils")

module.exports = {

    list: async (req, res) => {
        try {

            var news = await News.list()

            var data = []

            for (const i in news) {
                var newsItem = news[i]

                var id = newsItem.id
                var title = newsItem.title 
                var img = newsItem.img
                var desc = newsItem.description 
                var createdAt = newsItem.created_at

                data.push({
                    id: id,
                    title: title, 
                    img: img, 
                    desc: desc,
                    created_at: fdate(createdAt)
                })
            }

            misc.response(res, 200, false, "", data)
        } catch(e) {
            console.log()
            misc.response(res, 400, true, "")
        }
    }, 
    
    find: async (req, res) => {
        try {   

            if(typeof req.params.id == "undefined" || req.params.id == "")
                throw new Error("Param id is required")

            var news = await News.find(
                req.params.id
            )

            if(news.length == 0) 
                throw new Error("News not found")
            
            var newsItem = news[0]

            var data = {
                id: newsItem.id,
                title: newsItem.title,
                img: newsItem.img,
                desc: newsItem.description,
                created_at: fdate(newsItem.created_at)
            }

            misc.response(res, 200, false, "", data)
        } catch(e) {
            console.log(e)
            misc.response(res, 400, true, e.message)
        }
    },

    delete: async (req, res) => {
        try {   

            if(typeof req.params.id == "undefined" || req.params.id == "")
                throw new Error("Param id is required")

            var news = await News.find(
                req.params.id
            )

            if(news.length == 0) 
                throw new Error("News not found")
            
            await News.delete(req.params.id)

            misc.response(res, 200, false, "")
        } catch(e) {
            console.log(e)
            misc.response(res, 400, true, e.message)
        }
    },

    insert: async (req, res) => {
        try {

            if(typeof req.body.title == "undefined" || req.body.title == "")
                throw new Error("Field title is required")

            if(typeof req.body.img == "undefined" || req.body.img == "")
                throw new Error("Field img is required")

            if(typeof req.body.description == "undefined" || req.body.description == "")
                throw new Error("Field description is required")

            await News.insert(
                req.body.title, 
                req.body.img, 
                req.body.description
            )

            misc.response(res, 200, false, "")

        } catch (e) {
            console.log(e)
            misc.response(res, 400, true, e.message)
        }
    },

}
