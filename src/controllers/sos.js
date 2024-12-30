
const misc = require('../helpers/response')
const Kbri = require('../models/Kbri')
const Sos = require('../models/Sos')
const User = require('../models/User')
const Chat = require('../models/Chat')

const { v4: uuidv4 } = require('uuid')

const { formatDateWithSos } = require('../helpers/utils')
const utils = require('../helpers/utils')

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

    checkAlreadyConfirmed: async (_, res) => {
        const { user_id } = req.body

        try {
            var checkAlreadyConfirmed = await Sos.checkAlreadyConfirmed(user_id)

            misc.response(res, 200, false, "", {
                confirmed: checkAlreadyConfirmed.length == 0 
                ? false 
                : true
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
        const { id, user_id, rate } = req.body

        try {

            if(typeof id == "undefined" || id == "")
                throw new Error("Field id is required")

            if(typeof rate == "undefined" || rate == "")
                throw new Error("Field rate is required")
        
            if(typeof user_id == "undefined" || user_id == "")
                throw new Error("Field user_id is required")

            await Sos.ratingSos(id, rate, user_id)
            await Sos.resolvedSos(id)

            const fcms = await User.getFcm(user_id)
            const token = fcms.length === 0 ? "-" : fcms[0].token

            await utils.sendFCM(
                `Anda telah menyelesaikan kasus ini`,
                `Terima kasih telah menggunakan layanan Raksha`, token, "resolved-sos",
                {
                    message: `Terima kasih telah menggunakan layanan Raksha`,
                    sos_id: "-",
                    chat_id: "-",
                    recipient_id: "-"
                }
            )

            misc.response(res, 200, false, "", null)
        } catch(e) {
            console.log(e)
            misc.response(res, 400, true, e.message)
        }
    },

    confirmSos: async (req, res) => {
        const { id, user_agent_id } = req.body 

        const chatId = uuidv4()

        try {

            if(typeof id == "undefined" || id == "")
                throw new Error("Field user_agent_id is required")

            if(typeof user_agent_id == "undefined" || user_agent_id == "")
                throw new Error("Field user_agent_id is required")

            const sos = await Sos.findById(id)
            const senderId = sos.length === 0 ? '-' : sos[0].user_id

            const agents = await User.getProfile(user_agent_id)
            const agentId = agents.length === 0 ? "-" : agents[0].user_id
            const agentName = agents.length === 0 ? "-" : agents[0].username

            const users = await User.getProfile(senderId)
            const senderName = users.length === 0 ? "-" : users[0].username

            await Chat.insertChat(chatId, senderId, user_agent_id, id)
            await Sos.approvalConfirm(id, user_agent_id)

            const fcms = await User.getFcm(senderId)
            const token = fcms.length === 0 ? "-" : fcms[0].token

            await utils.sendFCM(
                `${agentName} telah terhubung dengan Anda`, 
                `Halo ${senderName}`, token, "confirm-sos",
                {
                    message: "testing",
                    sos_id: id,
                    chat_id: chatId,
                    recipient_id: user_agent_id
                }
            );

            misc.response(res, 200, false, "", {
                sos_id: id,
                chat_id: chatId,
                agent_id: agentId,
                agent_name: agentName
            })
        } catch(e) {
            misc.response(res, 400, true, e.messsage)
        }
    },

    closeSos: async (req, res) => {
        const { id, note } = req.body 

        try {

            if(typeof id == "undefined" || id == "")
                throw new Error("Field id is required")

            if(typeof note == "undefined" || note == "")
                throw new Error("Field note is required")

            const sos = await Sos.findById(id)

            const chats = await Chat.getChatBySosId(id)

            const chatId = chats.length === 0 ? "-" : chats[0].uid

            await Sos.moveSosToClosed(id)
            await Sos.updateExpireMessages(chatId)
        
            const userId = sos.length === 0 ? "-" : sos[0].user_agent_id
            const recipientId = sos.length === 0 ? "-" : sos[0].user_id

            const fcms = await User.getFcm(recipientId)
            const token = fcms.length === 0 ? "-" : fcms[0].token

            const agents = await User.getProfile(userId)
            const agentName = agents.length === 0 ? "-" : agents[0].username

            await utils.sendFCM(
                `${agentName} telah menutup kasus ini`, 
                note, token, "closed-sos",
                {
                    message: note,
                    sos_id: "-",
                    chat_id: "-",
                    recipient_id: "-"
                }
            );

            await Sos.closeSos(id, note)

            misc.response(res, 200, false, "", {
                sos_id: id
            })
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