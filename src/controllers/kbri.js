require("dotenv").config()

const misc = require('../helpers/response')
const Event = require("../models/Event")
const Kbri = require("../models/Kbri")

module.exports = {

    infoKbri: async (req, res) => {
        const { id } = req.params

        try {

            if(typeof id == "undefined" || id == ":id")
                throw new Error("Param id is required")

            var kbris = await Kbri.infoKbri(id)
         
            if(kbris.length == 0)
                throw new Error("Kbri not found")

            var data = kbris[0]

            misc.response(res, 200, false, "", data)
        } catch(e) {
            console.log(e)
            misc.response(res, 400, true, e.message)
        }
    },

    infoKbriState: async (req, res) => {
        const { state_id } = req.params

        try {

            if(typeof state_id == "undefined" || state_id == ":state_id")
                throw new Error("Param state_id is required")

            var kbris = await Kbri.infoKbriByState(state_id)

            if(kbris.length == 0)
                throw new Error("Kbri not found")

            var data = kbris[0]

            misc.response(res, 200, false, "",  data)
        } catch(e) {
            console.log(e)
            misc.response(res, 400, true, e.message)
        }
    },

    formKbri: async (req, res) => {
        const { title, img, description, lat, lng, address, emergency_call, state_id } = req.body

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

            if(typeof address == "undefined" || address == "")
                throw new Error("Field address is required")

            if(typeof emergency_call == "undefined" || emergency_call == "")
                throw new Error("Field emergency_call is required")
            
            if(typeof state_id == "undefined" || state_id == "")
                throw new Error("Field state_id is required")

            await Kbri.formKbri(title, img, description, lat, lng, address, state_id)

            misc.response(res, 200, false, "")

        } catch (e) {
            console.log(e)
            misc.response(res, 400, true, e.message)
        }
    },

}
