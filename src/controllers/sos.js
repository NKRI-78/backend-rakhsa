
const misc = require('../helpers/response')
const Kbri = require('../models/Kbri')
const Sos = require('../models/Sos')
const User = require('../models/User')
const Chat = require('../models/Chat')

const { formatDateWithSos } = require('../helpers/utils')

module.exports = {

    allBadge: async (_, res) => {
        try {
            var badgeLive = await Sos.badgeLive()
            var badgeResolved = await Sos.badgeResolved()
            var badgeClosed = await Sos.badgeClosed()

            misc.response(res, 200, false, "", {
                live: badgeLive.length == 0 ? 0 : badgeLive[0].count,
                resolved: badgeResolved.length == 0 ? 0 : badgeResolved[0].count,
                closed: badgeClosed.length == 0 ? 0 : badgeClosed[0].count
            })
        } catch(e) {
            misc.response(res, 400, true, e.message)
        }
    },
    
    list: async (req, res) => {
        const { type, platform_type } = req.query

        try {

            if(typeof type == "undefined" || type == "") 
                throw new Error("Param type is required")

            if(typeof platform_type == "undefined" || platform_type == "")
                throw new Error("Param platform_type is required")

            var sos = await Sos.list(type, platform_type)

            var data = []

            for (const i in sos) {
                var sosItem = sos[i]

                var chats = await Chat.checkConversationBySosId(
                    sosItem.uid
                )

                var sender = await User.getUser(sosItem.user_id)
                var agent = await User.getUser(sosItem.user_agent_id)

                var kbri = await Kbri.userKbri(sosItem.user_agent_id)

                var senderId =  sender.length == 0 ? "-" : sender[0].user_id
                var senderName = sender.length == 0 ? "-" : sender[0].username

                var agentId = agent.length == 0 ? "-" : agent[0].user_id
                var agentName = agent.length == 0 ? "-" : agent[0].username

                var continentName = kbri.length == 0 ? "-" : kbri[0].continent_name

                var ratings = await Sos.rating(sosItem.uid)

                data.push({
                    id: sosItem.uid,
                    media: sosItem.media,
                    type: sosItem.type,
                    ratings: ratings,
                    location: sosItem.location,
                    country: sosItem.country,
                    ticket: chats.length == 0 
                    ? "" 
                    : `#${chats[0].id}`,
                    chat_id: chats.length == 0 
                    ? "-" 
                    : chats[0].uid,
                    lat: sosItem.lat,
                    lng: sosItem.lng,
                    time: sosItem.time,
                    created: formatDateWithSos(sosItem.created_at),
                    created_at: formatDateWithSos(sosItem.created_at),
                    status: sosItem.status,
                    platform_type: sosItem.platform,
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

            var senderId =  sender.length == 0 ? "-" : sender[0].user_id
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

    ratingSos: async (req, res) => {
        const { id, rate, user_id } = req.body

        try {

            if(typeof id == "undefined" || id == "")
                throw new Error("Field id is required")

            if(typeof rate == "undefined" || rate == "")
                throw new Error("Field rate is required")
        
            if(typeof user_id == "undefined" || user_id == "")
                throw new Error("Field user_id is required")

            await Sos.ratingSos(id, rate, user_id)
            await Sos.resolveSos(id)

            misc.response(res, 200, false, "", null)
        } catch(e) {
            console.log(e)
            misc.response(res, 400, true, e.message)
        }
    },

    closeSos: async (req, res) => {
        const { id, note } = req.body 

        try {

            if(typeof id == "undefined" || id == "")
                throw new Error("Field id is required")

            if(typeof note == "undefined" || note == "")
                throw new Error("Field note is required")

            await Sos.closeSos(id, note)

            misc.response(res, 200, false, "", null)
        } catch(e) {
            console.log(e)
            misc.response(res, 400, true, e.message)
        }
    },

    moveSosToRecently: async (req, res) => {
        const { id } = req.body 

        try {

            if(typeof id == "undefined" || id == "")
                throw new Error("Field id is required")

            await Sos.moveSosToRecently(id)

            misc.response(res, 200, false, "", null)
        } catch(e) {
            console.log(e)
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
                throw new Error("SOS not found")

            var checkExpireSos = await Sos.checkExpireSos(id)

            if(checkExpireSos.length == 1)
                throw new Error("SOS already finish")

            var conversations = await Chat.checkConversationBySosId(id)

            if(conversations.length == 0)
                throw new Error("Chat not found")

            var chatId = conversations[0].uid

            await Chat.updateExpireMessages(chatId)

            misc.response(res, 200, false, "", null)
        } catch(e) {
            misc.response(res, 400, true, e.message)
        }
    }
        
}