const Admin = require("../models/Admin")

module.exports = {

    confirmSos: async (req, res) => {
        try {

            if(req.body.sos_id == "undefined" || req.body.sos_id == "")
                throw new Error("Field sos_id is required")

            if(req.body.user_id == "undefined" || req.body.user_id == "")
                throw new Error("Field user_d is required")

            await Admin.confirmSos(
                req.body.sos_id,
                req.body.user_id
            )
            
            misc.response(res, 200, false, "")

        } catch(e) {
            console.log(e)
            misc.response(res, 400, true, e.message)
        }
    } 

}