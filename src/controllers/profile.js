const Profile = require("../models/Profile")

const misc = require("../helpers/response")

module.exports = {

    updateAddress: async (req, res) => {
        try {

            if(typeof req.body.user_id == "undefined" || req.body.user_id == "")
                throw new Error("Field user_id is required")

            if(typeof req.body.address == "undefined" || req.body.address == "")
                throw new Error("Field address is required")

            await Profile.updateAddress(
                req.body.user_id, 
                req.body.address
            )

            misc.response(res, 200, false, "")

        } catch(e) {
            console.log(e)
            misc.response(res, 400, true, e.message)
        } 
    }

}