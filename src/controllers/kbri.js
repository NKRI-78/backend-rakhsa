require("dotenv").config()

const misc = require('../helpers/response')

module.exports = {

    infoKbri: async (req, res) => {
        const { id } = req.params

        try {

            if(typeof id == ":id" || id == "")
                throw new Error("Param id is required")


            misc.response(res, 200, false, "")
        } catch(e) {
            console.log(e)
            misc.response(res, 400, true, e.message)
        }
    },

    formKbri: async (req, res) => {
        const { title, img, description, lat, lng, state_id } = req.body

        try {

            if(typeof title == "undefined" || title == "")
                throw new Error("Field title is required")

            if(typeof img == "undefined" || img == "")
                throw new Error("Field img is required")

            if(typeof description == "undefined" || description == "")
                throw new Error("Field description is required")

            if(typeof lat == "undefined" || lat == "")
                throw new Error("Field lat is required")

            if(typeof lng == "undefined" || lng == "")
                throw new Error("Field lng is required")
            
            if(typeof state_id == "undefined" || state_id == "")
                throw new Error("Field state_id is required")

            await 

            misc.response(res, 200, false, "")

        } catch (e) {
            console.log(e)
            misc.response(res, 400, true, e.message)
        }
    },

}
