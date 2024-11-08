require("dotenv").config()

const misc = require('../helpers/response')
const axios = require('axios')
const Fcm = require("../models/Fcm")

module.exports = {

     all: async (req, res) => {
        const { origin_lat, origin_lng, user_id } = req.body 
   
        var page = parseInt(req.query.page) || 1
        var limit = parseInt(req.query.limit) || 10

        var offset = (page - 1) * limit

        try {           

            if(typeof origin_lat == "undefined" || origin_lat == "")
                throw new Error("origin_lat wajib diisi")

            if(typeof origin_lng == "undefined" || origin_lng == "")
                throw new Error("origin_lng wajib diisi")

            if(typeof user_id == "undefined" || user_id == "")
                throw new Error("user_id wajib diisi")

            var userlatlng = await Fcm.userLatLngPagination(offset, limit, String(origin_lat), String(origin_lng), user_id) 

            var resultTotal = limit > 10 ? Math.ceil(userlatlng.length / limit) : userlatlng.length
            var perPage = Math.ceil(resultTotal / limit)
            var prevPage = page === 1 ? 1 : page - 1
            var nextPage = page === perPage ? 1 : page + 1

            var data = []
            for(var i in userlatlng) {

                var avatar = userlatlng[i].avatar ?? ""
                var fullname = userlatlng[i].fullname ?? ""
                var email = userlatlng[i].email ?? ""
                var phone = userlatlng[i].phone ?? ""
                var dest_lat = userlatlng[i].lat ?? ""
                var dest_lng = userlatlng[i].lng ?? ""

                const url = `${process.env.GMAP_URL}?origin=${origin_lat},${origin_lng}&destination=${dest_lat},${dest_lng}&key=${process.env.GMAP_KEY}`
            
                const res = await axios.get(url)

                if(res.status == 200) {
                    var routes = res.data.routes

                    for(var z in routes) {

                        var txt = routes[z].legs[0].distance.text

                        var distance = Math.round(txt.split(' ')[0])

                        if(distance <= 5) {
                            data.push({
                                user: {
                                    avatar: avatar,
                                    name: fullname,
                                    email: email,
                                    phone: phone
                                },
                                lat: dest_lat,
                                lng: dest_lng,
                                distance: routes[z].legs[0].distance.text
                            })
                        }
                    }
                }
            }

            const pageDetail = {
                total: resultTotal,
                per_page: perPage,
                next_page: nextPage,
                prev_page: prevPage,
                current_page: page,
                next_url: `${process.env.BASE_URL}${req.originalUrl.replace("page=" + page, "page=" + nextPage)}`,
                prev_url: `${process.env.BASE_URL}${req.originalUrl.replace("page=" + page, "page=" + prevPage)}`
            }

            misc.responsePagination(res, 200, false, "", pageDetail, data)
        } catch(e) {
            console.log(e)
            misc.response(res, 400, true, e.message)
        }

    }, 

}
