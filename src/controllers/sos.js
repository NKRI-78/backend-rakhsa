
const misc = require('../helpers/response')
const Kbri = require('../models/Kbri')
const Sos = require('../models/Sos')
const User = require('../models/User')

module.exports = {
    
    list: async (_, res) => {
        try {

            var sos = await Sos.list()

            var data = []

            for (const i in sos) {
                var sosItem = sos[i]

                var sender = await User.getUser(sosItem.user_id)
                var agent = await User.getUser(sosItem.user_agent_id)

                var kbri = await Kbri.userKbri(sosItem.user_agent_id)

                data.push({
                    id: sosItem.uid,
                    location: sosItem.location,
                    time: sosItem.time,
                    country: sosItem.country,
                    is_confirm: sosItem.is_confirm == 1 
                    ? true 
                    : false,
                    sender: {
                        id: sender.length == 0 
                        ? "-" 
                        : sender[0].user_id,
                        name: sender.length == 0 
                        ? "-"
                        : sender[0].username
                    },
                    agent: {
                        id: agent.length == 0 
                        ? "-" 
                        : agent[0].user_id,
                        name: agent.length == 0 
                        ? "-"
                        : agent[0].username,
                        kbri: {
                            continent: {
                                name: kbri.length == 0 
                                ? "-" 
                                : kbri[0].continent_name
                            }
                        }
                    }
                })
            }

            misc.response(res, 200, false, "", data)
        } catch(e) {
            misc.response(res, 400, true, e.message)
        }
    }
        
}