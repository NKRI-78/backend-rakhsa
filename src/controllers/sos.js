
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

                var senderId =  sender.length == 0 ? "-" : sender[0].id
                var senderName = sender.length == 0 ? "-" : sender[0].username

                var agentId = agent.length == 0 ? "-" : agent[0].user_id
                var agentName = agent.length == 0 ? "-" : agent[0].username

                var continentName = kbri.length == 0 ? "-" : kbri[0].continent_name

                data.push({
                    id: sosItem.uid,
                    media: sosItem.media,
                    location: sosItem.location,
                    country: sosItem.country,
                    lat: sosItem.lat,
                    lng: sosItem.lng,
                    time: sosItem.time,
                    is_confirm: sosItem.is_confirm == 1 
                    ? true 
                    : false,
                    sender: {
                        id: senderId,
                        name: senderName
                    },
                    agent: {
                        id: agentId,
                        name: agentName,
                        kbri: {
                            continent: {
                                name: continentName
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