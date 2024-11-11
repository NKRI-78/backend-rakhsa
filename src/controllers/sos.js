
const misc = require('../helpers/response')
const Sos = require('../models/Sos')

module.exports = {
    
    list: async (req, res) => {
        try {

            var sos = await Sos.list()

            // var agent = await Use

            misc.response(res, 200, false, "")
        } catch(e) {
            misc.response(res, 400, true, "Server error")
        }
    }
        
}