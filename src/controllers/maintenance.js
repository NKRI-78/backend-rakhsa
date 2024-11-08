require("dotenv").config()

const misc = require('../helpers/response')
const Maintenance = require("../models/Maintenance")

module.exports = {

    maintenance: async(_, res) => {
        try {
            var maintenance = await Maintenance.maintenance()

            misc.response(res, 200, false, "", {
                maintenance: maintenance[0].maintenance == 0 ? false : true 
            })
        } catch(e) {
            console.log(e)
            misc.response(res, 400, true, "Server error")
        }
    }, 

    showDemo: async(_, res) => {
        try {
            var showDemo = await Maintenance.showDemo()
            
            misc.response(res, 200, false, "", {
                show_demo: showDemo[0].showdemo == 0 ? false : true
            })
        } catch(e) {
            console.log(e) 
            misc.response(res, 400, true, "Server error")
        }
    },

}