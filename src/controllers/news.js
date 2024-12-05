require("dotenv").config()

const misc = require('../helpers/response')
const News = require("../models/News")

const { fdate } = require("../helpers/utils")

module.exports = {

    list: async (req, res) => {

        const { type, lat, lng, is_admin } = req.query

        try {

            if(typeof type == "undefined" || type == "")
                throw new Error("Param Query type is required")

            var news = await News.list(type, lat, lng, is_admin)

            var data = []

            for (const i in news) {
                var newsItem = news[i]

                var id = newsItem.id
                var title = newsItem.title 
                var img = newsItem.img
                var desc = newsItem.description 
                var newsType = newsItem.news_type 
                var createdAt = newsItem.created_at

                data.push({
                    id: id,
                    title: title, 
                    img: img, 
                    desc: desc,
                    lat: newsItem.lat,
                    lng: newsItem.lng,
                    type: newsType,
                    created_at: fdate(createdAt)
                })
            }

            misc.response(res, 200, false, "", data)
        } catch(e) {
            console.log(e)
            misc.response(res, 400, true, e.message)
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
                lat: newsItem.lat,
                lng: newsItem.lng,
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

    update: async (req, res) => {
        try {   

            if(typeof req.params.id == "undefined" || req.params.id == "")
                throw new Error("Param id is required")

            await News.update(
                req.params.id,
                req.body.title, 
                req.body.description,
                req.body.lat, 
                req.body.lng
            )

            misc.response(res, 200, false, "")
        } catch(e) {
            console.log(e)
            misc.response(res, 400, true, e.message)
        }
    },

    
    updateImage: async (req, res) => {
        try {   

            if(typeof req.params.id == "undefined" || req.params.id == "")
                throw new Error("Param id is required")

            await News.updateImage(
                req.params.id,
                req.body.img
            )

            misc.response(res, 200, false, "")
        } catch(e) {
            console.log(e)
            misc.response(res, 400, true, e.message)
        }
    },

    insert: async (req, res) => {

        const { title, img, description, lat, lng, type } = req.body

        try {

            if(typeof title == "undefined" || title == "")
                throw new Error("Field title is required")

            if(typeof img == "undefined" || img == "")
                throw new Error("Field img is required")

            if(typeof description == "undefined" || description == "")
                throw new Error("Field description is required")

            if(typeof lat == "undefined" || lat == "")
                throw new Error("Field lat is required")

            await News.insert(
                title, 
                img, 
                description,
                lat,
                lng,
                type
            )

            misc.response(res, 200, false, "")

        } catch (e) {
            console.log(e)
            misc.response(res, 400, true, e.message)
        }
    },

}
