const Profile = require("../models/Profile")

const misc = require("../helpers/response")
const User = require("../models/User")
const { fdate } = require("../helpers/utils")

module.exports = {

    getProfile: async (req, res) => {
        try {

            if(req.body.user_id == "undefined")
                throw new Error("Field user_id is required")
        
            var users = await User.getUser(req.body.user_id)

            if(users.length == 0)
                throw new Error("User not found")

            var user = users[0]

            misc.response(res, 200, false, "", {
                id: user.user_id,
                username: user.username,
                avatar: user.avatar,
                address: user.address ?? "-",
                passport: user.passport ?? "-",
                emergency_contact: user.emergency_contact ?? "-",
                created_at: fdate(user.created_at)
            })
        } catch(e) {
            console.log(e)
            misc.response(res, 400, true, e.message)
        }
    },

    updateAddress: async (req, res) => {
        try {

            if(typeof req.body.user_id == "undefined" || req.body.user_id == "")
                throw new Error("Field user_id is required")

            if(typeof req.body.address == "undefined" || req.body.address == "")
                throw new Error("Field address is required")

            if(typeof req.body.lat == "undefined" || req.body.lat == "")
                throw new Error("Field lat is required")

            if(typeof req.body.lng == "undefined" || req.body.lng == "")
                throw new Error("Field lng is required")

            await Profile.updateAddress(
                req.body.user_id, 
                req.body.lat, 
                req.body.lng,
                req.body.address
            )

            misc.response(res, 200, false, "")

        } catch(e) {
            console.log(e)
            misc.response(res, 400, true, e.message)
        } 
    }

}