const Chat = require("../models/Chat")
 
const misc = require("../helpers/response")

const moment = require('moment')

module.exports = {

    messages: async (req, res) => {

        const { sender_id, chat_id, is_agent } = req.body
    
        try {

            if(typeof sender_id == "undefined" || sender_id == "")
                throw new Error("Field sender_id is required")
    
            if(typeof chat_id == "undefined" || chat_id == "")
                throw new Error("Field chat_id is required")
        
            var recipients = await Chat.getChat(
                chat_id,
                sender_id,
            )
    
            if(recipients.length == 0)
                throw new Error("Recipient not found")
    
            var recipient = recipients[0]
    
            var messages = await Chat.getMessages(
                chat_id, 
                sender_id,
                is_agent
            )
    
            var messageData = []
    
            for (const i in messages) {
                var message = messages[i]
    
                messageData.push({
                    id: message.msg_id,
                    chat_id: chat_id,
                    user: {
                        id: message.sender_id,
                        avatar: message.avatar ?? "-",
                        name: message.sender_name,
                        is_me: sender_id == message.sender_id 
                        ? true 
                        : false  
                    },
                    is_read: message.ack == "READ"
                    ? true 
                    : false,
                    created_at: moment(message.created_at).format('YYYY-MM-DD HH:mm:ss'),
                    sent_time: moment(message.created_at).format('HH:mm'),
                    text: message.content
                })
            }
    
            misc.response(res, 200, false, "", {
                recipient: {
                    id: recipient.user_id,
                    avatar: recipient.avatar ?? "-",
                    name: recipient.fullname,
                    is_typing: false,
                    is_online: recipient.is_online == 1 
                    ? true 
                    : false,
                    last_active: moment(recipient.last_active).format('YYYY-MM-DD HH:mm:ss')
                },
                messages: messageData
            })
    
        } catch(e) {
    
            console.log(e)

            misc.response(res, 400, true, e.message, null)
    
        }
    },


    list: async (req, res) => {

        const { user_id, is_agent } = req.body

        try {
    
            if(typeof user_id == "undefined" || user_id == "")
                throw new Error("Field user_id is required")
    
            var chats = await Chat.getChats(user_id)
    
            var data = []
    
            for (const i in chats) {
                var chat = chats[i]
    
                var messages = await Chat.getLastMessage(chat.chat_id, is_agent)
    
                var unreads = await Chat.getMessageUnread(chat.chat_id)
    
                var messageData = []
    
                for (const i in messages) {
                    var message = messages[i]
    
                    var isMe = message.sender_id == user_id ? true : false
    
                    messageData.push({
                        id: message.uid,
                        content: message.content,
                        is_read: message.ack == "READ" 
                        ? true
                        : false,
                        is_typing: false,
                        is_me: isMe,
                        type: message.type,
                        time: moment(message.created_at).format('HH:mm')
                    })
                }
    
                data.push({
                    chat: {
                        id: chat.chat_id
                    },
                    user: {
                        id: chat.user_id,
                        avatar: chat.avatar ?? "-",
                        name: chat.fullname,
                    },
                    count_unread: unreads.length,
                    messages: messageData
                })
            }
    
            misc.response(res, 200, false, "", data)
    
        } catch(e) {
            console.log(e)
            misc.response(res, 400, true, e.message, null)
        }
    }

}