
const misc = require('../helpers/response')
const Kbri = require('../models/Kbri')
const Sos = require('../models/Sos')
const User = require('../models/User')
const Chat = require('../models/Chat')

module.exports = {
    
    list: async (req, res) => {
        const { is_confirm } = req.query

        try {

            if(typeof is_confirm == "undefined" || is_confirm == "") 
                throw new Error("Param is_confirm is required")

            var sos = await Sos.list(is_confirm)

            var data = []

            for (const i in sos) {
                var sosItem = sos[i]

                var chats = await Chat.checkConversation(sosItem.user_id, sosItem.user_agent_id)

                var sender = await User.getUser(sosItem.user_id)
                var agent = await User.getUser(sosItem.user_agent_id)

                var kbri = await Kbri.userKbri(sosItem.user_agent_id)

                var senderId =  sender.length == 0 ? "-" : sender[0].user_id
                var senderName = sender.length == 0 ? "-" : sender[0].username

                var agentId = agent.length == 0 ? "-" : agent[0].user_id
                var agentName = agent.length == 0 ? "-" : agent[0].username

                var continentName = kbri.length == 0 ? "-" : kbri[0].continent_name

                data.push({
                    id: sosItem.uid,
                    media: sosItem.media,
                    type: sosItem.type,
                    location: sosItem.location,
                    country: sosItem.country,
                    chat_id: chats.length == 0 
                    ? '-' 
                    : chats[0].uid,
                    lat: sosItem.lat,
                    lng: sosItem.lng,
                    time: sosItem.time,
                    is_confirm: sosItem.is_confirm == 1 
                    ? true 
                    : false,
                    is_finish: sosItem.is_finish == 1 
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
    },

    detail: async (req, res) => {
        const { id } = req.params

        try {

            if(typeof id == "undefined" || id == "")
                throw new Error("Field id is required")

            var sos = await Sos.detail(id)

            if(sos.length == 0) 
                throw new Error("SOS not found")

            var sosItem = sos[0]

            var sender = await User.getUser(sosItem.user_id)
            var agent = await User.getUser(sosItem.user_agent_id)

            var kbri = await Kbri.userKbri(sosItem.user_agent_id)

            var senderId =  sender.length == 0 ? "-" : sender[0].id
            var senderName = sender.length == 0 ? "-" : sender[0].username

            var agentId = agent.length == 0 ? "-" : agent[0].user_id
            var agentName = agent.length == 0 ? "-" : agent[0].username

            var continentName = kbri.length == 0 ? "-" : kbri[0].continent_name

            misc.response(res, 200, false, "", {
                id: sosItem.uid,
                media: sosItem.media,
                type: sosItem.type,
                location: sosItem.location,
                country: sosItem.country,
                lat: sosItem.lat,
                lng: sosItem.lng,
                time: sosItem.time,
                is_confirm: sosItem.is_confirm == 1 
                ? true 
                : false,
                is_finish: sosItem.is_finish == 1 
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
        } catch(e) {
            misc.response(res, 400, true, e.message)
        }

    },

    expireSos: async (req, res) => {
        const { id } = req.body
         
        try {

            if(typeof id == "undefined" || id == "")
                throw new Error("Field id is required")

            var checkSos = await Sos.checkSos(id)

            if(checkSos.length == 0) 
                throw new Error("Sos not found")

            var senderId = checkSos[0].user_id 
            var recipientId = checkSos[0].user_agent_id

            var checkExpireSos = await Sos.checkExpireSos(id)

            if(checkExpireSos.length == 1)
                throw new Error("Sos already finish")

            await Sos.expireSos(id)

            await Chat.updateExpireMessagesSender(
                senderId, 
                recipientId
            )

            await Chat.updateExpireMessagesReceiver(
                recipientId,
                senderId
            )

            misc.response(res, 200, false, "", null)
        } catch(e) {
            misc.response(res, 400, true, e.message)
        }
    }
        
}