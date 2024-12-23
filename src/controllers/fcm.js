const Profile = require("../models/Profile")

module.exports = {

    initFcm: async (req, res) => {

        const { user_id, token } = req.body

        try {

            if(typeof user_id == "undefined" || user_id == "")
                throw new Error("Field user_id is required")

            if(typeof token == "undefined" || token == "")
                throw new Error("Field token is required")

            await Profile.initFcm(
                avatar,
                user_id, 
            )

            misc.response(res, 200, false, "")

        } catch(e) {
            console.log(e)
            misc.response(res, 400, true, e.message)
        } 
    },

}