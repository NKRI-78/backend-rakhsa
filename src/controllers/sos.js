
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
        const { id, user_id, rate } = req.body;
    
        try {
            if (!id?.trim() || !rate?.trim() || !user_id?.trim()) {
                throw new Error("Fields 'id', 'rate', and 'user_id' are required.");
            }
    
            await Sos.ratingSos(id, rate, user_id);
            await Sos.resolvedSos(id);
    
            const fcms = await User.getFcm(user_id);
            const token = fcms[0]?.token || "-";
    
            // Send notification
            await utils.sendFCM(
                `Anda telah menyelesaikan kasus ini`,
                `Terima kasih telah menggunakan layanan Raksha`,
                token,
                "resolved-sos",
                {
                    message: `Terima kasih telah menggunakan layanan Raksha`,
                    sos_id: id,
                    chat_id: "-",
                    recipient_id: user_id
                }
            );
    
            misc.response(res, 200, false, "SOS rated and resolved successfully.", null);
        } catch (e) {
            console.error("Error in ratingSos:", e);
            misc.response(res, 400, true, e.message || "An unexpected error occurred.");
        }
    },
    

    confirmSos: async (req, res) => {
        const { id, user_agent_id } = req.body;
    
        if (!id || !user_agent_id) {
            throw new Error( "Both 'id' and 'user_agent_id' fields are required.");
        }
    
        const chatId = uuidv4();
    
        try {
            const [sos, agents, users] = await Promise.all([
                Sos.findById(id),
                User.getProfile(user_agent_id),
                User.getProfile((await Sos.findById(id))[0]?.user_id || "-")
            ]);
    
            const senderId = sos[0]?.user_id || "-";
            const agentId = agents[0]?.user_id || "-";
            const agentName = agents[0]?.username || "-";
            const senderName = users[0]?.username || "-";
    
            await Promise.all([
                Chat.insertChat(chatId, senderId, user_agent_id, id),
                Sos.approvalConfirm(id, user_agent_id)
            ]);
    
            const fcms = await User.getFcm(senderId);
            const token = fcms[0]?.token || "-";
    
            await utils.sendFCM(
                `${agentName} telah terhubung dengan Anda`,
                `Halo ${senderName}`,
                token,
                "confirm-sos",
                {
                    message: "confirm-sos",
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
            });
        } catch (e) {
            misc.response(res, 400, true, e.message || "An error occurred.");
        }
    },
    

    closeSos: async (req, res) => {
        const { id, note, handleby } = req.body;
    
        try {
            if (!id?.trim() || !note?.trim()) {
                throw new Error("Fields 'id' and 'note' are required.");
            }
    
            const sos = await Sos.findById(id);
            if (!sos || sos.length === 0) {
                throw new Error(`SOS with ID ${id} not found.`);
            }
    
            const chats = await Chat.getChatBySosId(id);
            const chatId = chats[0]?.uid || "-";
    
            await Sos.moveSosToClosed(id);
            await Sos.updateExpireMessages(chatId);
    
            const userId = sos[0]?.user_agent_id || "-";
            const recipientId = sos[0]?.user_id || "-";
    
            const [fcms, agents] = await Promise.all([
                User.getFcm(recipientId),
                User.getProfile(userId)
            ]);
    
            const token = fcms[0]?.token || "-";
            const agentName = agents[0]?.username || "Unknown Agent";
    
            await utils.sendFCM(
                `${agentName} telah menutup kasus ini`,
                note,
                token,
                "closed-sos",
                {
                    message: note,
                    sos_id: id,
                    chat_id: chatId,
                    recipient_id: recipientId
                }
            );
    
            await Sos.closeSos(id, note, handleby);
    
            misc.response(res, 200, false, "SOS closed successfully.", {
                sos_id: id
            });
        } catch (e) {
            console.error("Error in closeSos:", e);
            misc.response(res, 400, true, e.message || "An unexpected error occurred.");
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