const Profile = require("../models/Profile")

const misc = require("../helpers/response")
const User = require("../models/User")
const { fdate } = require("../helpers/utils")

module.exports = {

    getProfile: async (req, res) => {

        const { user_id } = req.body

        try {

            if(user_id == "undefined")
                throw new Error("Field user_id is required")
        
            var users = await User.getUser(user_id)

            if(users.length == 0)
                throw new Error("User not found")

            var user = users[0]

            misc.response(res, 200, false, "", {
                id: user.user_id,
                username: user.username,
                email: user.email,
                avatar: user.avatar,
                address: user.address ?? "-",
                passport: user.passport ?? "-",
                contact: user.contact ?? "-",
                emergency_contact: user.emergency_contact ?? "-",
                created_at: fdate(user.created_at)
            })
        } catch(e) {
            console.log(e)
            misc.response(res, 400, true, e.message)
        }
    },

    updateProfile: async (req, res) => {

        const { avatar, user_id } = req.body

        try {

            if(typeof avatar == "undefined" || avatar == "")
                throw new Error("Field avatar is required")

            if(typeof user_id == "undefined" || user_id == "")
                throw new Error("Field user_id is required")

            await Profile.updateProfileAvatar(
                avatar,
                user_id, 
            )

            misc.response(res, 200, false, "")

        } catch(e) {
            console.log(e)
            misc.response(res, 400, true, e.message)
        } 
    },

    updateAddress: async (req, res) => {

        const { user_id, address, lat, lng } = req.body

        try {

            if(typeof user_id == "undefined" || user_id == "")
                throw new Error("Field user_id is required")

            if(typeof lat == "undefined" || lat == "")
                throw new Error("Field lat is required")

            if(typeof lng == "undefined" || lng == "")
                throw new Error("Field lng is required")

            if(typeof address == "undefined" || address == "")
                throw new Error("Field address is required")

            await Profile.updateAddress(
                user_id, 
                lat, 
                lng,
                address
            )

            misc.response(res, 200, false, "")

        } catch(e) {
            console.log(e)
            misc.response(res, 400, true, e.message)
        } 
    }

}