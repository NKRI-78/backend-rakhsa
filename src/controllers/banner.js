const Banner = require("../models/Banner")
const misc = require("../helpers/response")
const utils = require("../helpers/utils")
const moment = require("moment")

module.exports = {

    all: async (_, res) => {
        try {   
            var banners = await Banner.all()

            var data = []
            
            for (var i in banners) {
                var banner = banners[i]
                data.push({
                    uid: banner.uid,
                    name: banner.name,
                    path: banner.path,
                    created_at: utils.formatDate(banner.created_at)
                })
            }

            misc.response(res, 200, false, "", data)
        } catch(e) {
            console.log(e)
            misc.response(res, 400, true, "Server error")
        }
    },

    createOrUpdate: async (req, res) => {
        const { id, name, path } = req.body
        
        try {

            if(typeof path == "undefined" || path == "")
                throw new Error("path wajib diisi")

            await Banner.createOrUpdate(id, name, path)

            misc.response(res, 200, false, "")
        } catch(e) {
            console.log(e)
            misc.response(res, 400, true, e.message)
        }
    },

    detail: async (req, res) => {
        const { id } = req.body 
        
        try {

            var banners = await Banner.detail(id)

            if(banners.length == 0) 
                throw new Error("Banner tidak ditemukan")

            var data = []

            for (var i in banners) {
                var item = banners[i]
                data.push({
                    uid: item.uid,
                    name: item.name,
                    image: item.path,
                    created_at: utils.formatDate(item.created_at)
                })
            }

            misc.response(res, 200, false, "", data[0])
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
            
            var banners = await Banner.detail(id)

            if(banners.length == 0) 
                throw new Error("Banner tidak ditemukan")

           await Banner.delete(id)
            misc.response(res, 200, false, "")
        } catch(e) {
            console.log(e)
            misc.response(res, 400, true, "Server error")
        }
    }
    
}