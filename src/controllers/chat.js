const Chat = require("../models/Chat")
 
const moment = require('moment')

const misc = require("../helpers/response")

module.exports = {

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
                    chat_id: req.body.chat_id,
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
    
            console.log(e)

            misc.response(res, 400, true, e.message, null)
    
        }
    }

}