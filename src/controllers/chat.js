const Chat = require("../models/Chat")

module.exports = {

    chat: async (req, res) => {

        try {
    
            if(typeof req.body.chat_id == "undefined" || req.body.chat_id == "")
                throw new Error("Field chat_id is required")
        
            if(typeof req.body.receiver_id == "undefined" || req.body.receiver_id == "")
                throw new Error("Field receiver_id is required")
    
            var chats = await Chat.getChat(
                req.body.chat_id, 
                req.body.receiver_id
            )
    
            if(chats.length == 0)
                throw new Error("Chat not found")
    
            var chat = chats[0]
    
            var data = {
                chat: {
                    id: chat.uid
                },
                image: chat.image,
                name: chat.name,
            }
    
            misc.response(res, 200, false, "", data)
    
        } catch(e) {
    
            misc.response(res, 400, true, e.message, null)
    
        }
    },

    chatList: async (req, res) => {
        try {

            if(typeof req.body.sender_id == "undefined" || req.body.sender_id == "")
                throw new Error("Field sender_id is required")
    
            var chats = await Chat.getChats(
                req.body.sender_id
            )
    
            var data = []
    
            for (const i in chats) {
                var chat = chats[i]
    
                var messages = await Chat.getLastMessage(chat.chat_id)
    
                var unreads = await Chat.getMessageUnread(chat.chat_id)
    
                var messageData = []
    
                for (const i in messages) {
                    var message = messages[i]
    
                    var isMe = message.sender_id == req.body.sender_id ? true : false
    
                    messageData.push({
                        id: message.uid,
                        content: message.content,
                        is_read: message.ack == "READ" 
                        ? true
                        : false,
                        is_typing: false,
                        is_me: isMe,
                        type: message.type,
                        time: moment(message.sent_time).format('HH:mm')
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
    },

    messages: async (req, res) => {
    
        try {
    
            if(typeof req.body.chat_id == "undefined" || req.body.chat_id == "")
                throw new Error("Field chat_id is required")
        
            var recipients = await Chat.getChat(
                req.body.chat_id,
                req.body.sender_id
            )
    
            if(recipients.length == 0)
                throw new Error("Recipient not found")
    
            var recipient = recipients[0]
    
            var messages = await Chat.getMessages(
                req.body.chat_id, 
                req.body.sender_id
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
                        is_me: req.body.sender_id == message.sender_id 
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
    
            misc.response(res, 400, true, e.message, null)
    
        }
    }

}