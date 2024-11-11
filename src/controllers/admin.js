const Admin = require("../models/Admin")

module.exports = {

    confirmSos: async (req, res) => {
        try {

            if(req.body.sos_id == "undefined" || req.body.sos_id == "")
                throw new Error("Field sos_id is required")

            await Admin.confirmSos(
                req.body.sos_id
            )
            
            misc.response(res, 200, false, null)

        } catch(e) {
            console.log(e)
            misc.response(res, 400, true, e.message)
        }
    } 

}