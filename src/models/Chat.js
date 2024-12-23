const conn = require('../configs/db')

module.exports = {

    checkConversation: (senderId, receiverId) => {
        return new Promise((resolve, reject) => {
            const query = `SELECT id, uid FROM chats 
            WHERE sender_id = ? AND receiver_id = ?
            OR receiver_id = ? AND sender_id = ?`

            conn.query(query, [senderId, receiverId, senderId, receiverId], (e, result) => {
                if(e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    checkConversationBySosId: (sosId) => {
        return new Promise((resolve, reject) => {
            const query = `SELECT uid FROM chats WHERE sos_id = ?`

            conn.query(query, [sosId], (e, result) => {
                if(e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },
    
    getChat: (chatId, senderId) => {
        return new Promise ((resolve, reject) => {
            const query = `SELECT 
                    c.uid AS chat_id, 
                    MAX(c.sos_id) AS sos_id, -- Distinct sos_id for each chat_id
                    c.id AS ticket,
                    sat.name AS status, 
                    s.agent_note as note,
                    p.user_id, 
                    p.fullname, 
                    p.avatar
                FROM chats c
                INNER JOIN users u ON (c.sender_id = u.uid OR c.receiver_id = u.uid)
                INNER JOIN profiles p ON p.user_id = u.uid
                INNER JOIN sos s ON s.uid = c.sos_id
                INNER JOIN sos_activity_types sat ON sat.id = s.sos_activity_type
                WHERE 
                    (
                        (c.sender_id = ? AND c.receiver_id = p.user_id) 
                        OR 
                        (c.receiver_id = ? AND c.sender_id = p.user_id)
                    )
                    AND c.uid = ?
                GROUP BY c.uid, c.id, sat.name, p.user_id, p.fullname, p.avatar
                ORDER BY c.uid;
            ` 
            conn.query(query, [senderId, senderId, chatId], (e, result) => {
                if(e) { 
                    reject(new Error(e))
                } else {
                    resolve(result)
                }``
            })
        })
    },

    getChats: (senderId, isAgent) => {
        return new Promise ((resolve, reject) => {
            var query = `SELECT 
            c.uid AS chat_id, 
            p.user_id, 
            p.fullname, 
            p.avatar, 
            c.created_at, 
            c.id AS ticket,
            c.sos_id, 
            sat.name AS status, 
            s.agent_note AS note
            FROM chats c
            INNER JOIN sos s ON s.uid = c.sos_id
            INNER JOIN sos_activity_types sat ON sat.id = s.sos_activity_type
            INNER JOIN users u ON u.uid IN (c.sender_id, c.receiver_id)
            INNER JOIN profiles p ON p.user_id = u.uid
            WHERE (
                (c.sender_id = ? AND c.receiver_id = p.user_id) 
                OR (c.receiver_id = ? AND c.sender_id = p.user_id)
            )
            AND s.sos_activity_type IN (3, 5) 
            ORDER BY c.id DESC`
            if(isAgent) {
                query = `SELECT 
                c.uid AS chat_id, 
                p.user_id, 
                p.fullname, 
                p.avatar, 
                c.created_at, 
                c.id AS ticket,
                c.sos_id, 
                sat.name AS status, 
                s.agent_note AS note
                FROM chats c
                INNER JOIN sos s ON s.uid = c.sos_id
                INNER JOIN sos_activity_types sat ON sat.id = s.sos_activity_type
                INNER JOIN users u ON u.uid IN (c.sender_id, c.receiver_id)
                INNER JOIN profiles p ON p.user_id = u.uid
                WHERE (
                    (c.sender_id = ? AND c.receiver_id = p.user_id) 
                    OR (c.receiver_id = ? AND c.sender_id = p.user_id)
                )
                AND s.sos_activity_type IN (3) 
                ORDER BY c.id DESC    
                `
            }
            conn.query(query, [senderId, senderId], (e, result) => {
                if(e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    checkMessages: (sender, receiverId) => {
        return new Promise ((resolve, reject) => {
            var query = `SELECT id FROM messages 
            WHERE sender_id = ? 
            OR receiver_id = ?
            ORDER BY created_at DESC`

            conn.query(query, [
                sender, receiverId
            ], (e, result) => {
                if(e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    updateExpireMessages: (chatId) => {
        return new Promise ((resolve, reject) => {
            var query = `UPDATE messages SET is_expired = 1 WHERE chat_id = ?`

            conn.query(query, [chatId], (e, result) => {
                if(e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    getMessages: (chatId, sender, isAgent, status) => {
        return new Promise ((resolve, reject) => {
            var query = `SELECT 
            p.fullname AS sender_name,
            p.avatar,
          	m.content, 
            m.created_at,
            mt.name type, m.uid AS msg_id, ma.name AS ack, c.uid AS chat_id, m.sender_id, m.receiver_id, m.created_at
            FROM messages m 
            INNER JOIN profiles p ON m.sender_id = p.user_id 
            INNER JOIN chats c ON c.uid = m.chat_id
            INNER JOIN message_acks ma ON ma.id = m.ack
            INNER JOIN message_types mt ON mt.id = m.type
            WHERE c.uid = ? 
            AND (m.sender_id = ? OR m.receiver_id = ?)
            AND m.is_expired = 0
            ORDER BY m.created_at DESC`

            if(isAgent == true) {
                query = `SELECT 
                p.fullname AS sender_name,
                p.avatar,
                m.content, 
                m.created_at,
                mt.name type, m.uid AS msg_id, ma.name AS ack, c.uid AS chat_id, m.sender_id, m.receiver_id, m.created_at
                FROM messages m 
                INNER JOIN profiles p ON m.sender_id = p.user_id 
                INNER JOIN chats c ON c.uid = m.chat_id
                INNER JOIN message_acks ma ON ma.id = m.ack
                INNER JOIN message_types mt ON mt.id = m.type
                WHERE c.uid = ? 
                AND (m.sender_id = ? OR m.receiver_id = ?)
                ORDER BY m.created_at DESC`
            }

            if(status == "CLOSED") {
                query = `SELECT 
                p.fullname AS sender_name,
                p.avatar,
                m.content, 
                m.created_at,
                mt.name type, m.uid AS msg_id, ma.name AS ack, c.uid AS chat_id, m.sender_id, m.receiver_id, m.created_at
                FROM messages m 
                INNER JOIN profiles p ON m.sender_id = p.user_id 
                INNER JOIN chats c ON c.uid = m.chat_id
                INNER JOIN message_acks ma ON ma.id = m.ack
                INNER JOIN message_types mt ON mt.id = m.type
                WHERE c.uid = ? 
                AND (m.sender_id = ? OR m.receiver_id = ?)
                ORDER BY m.created_at DESC`
            }

            conn.query(query, [
                chatId, sender, 
                sender
            ], (e, result) => {
                if(e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    getLastMessage: (chatId, isAgent) => {
        return new Promise ((resolve, reject) => {
            var query = `SELECT m.uid, m.content, 
            mt.name type, m.created_at, ma.name AS ack, m.sender_id
            FROM messages m 
            INNER JOIN message_acks ma ON ma.id = m.ack
            INNER JOIN chats c ON c.uid = m.chat_id
            INNER JOIN message_types mt ON mt.id = m.type
            WHERE c.uid = ? 
            ORDER BY m.created_at DESC 
            LIMIT 1`

            if(isAgent == false) {
                query = `SELECT m.uid, m.content, 
                mt.name type, m.created_at, ma.name AS ack, m.sender_id
                FROM messages m 
                INNER JOIN message_acks ma ON ma.id = m.ack
                INNER JOIN chats c ON c.uid = m.chat_id
                INNER JOIN message_types mt ON mt.id = m.type
                WHERE c.uid = ? 
                AND m.is_expired = 0
                ORDER BY m.created_at DESC 
                LIMIT 1`
            }

            conn.query(query, [chatId], (e, result) => {
                if(e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    getMessageUnread: (chatId) => {
        return new Promise ((resolve, reject) => {
            const query = `SELECT m.uid
            FROM messages m 
            INNER JOIN chats c ON c.uid = m.chat_id
            INNER JOIN message_types mt ON mt.id = m.type
            WHERE c.uid = ? AND m.ack = 2`

            conn.query(query,  [chatId], (e, result) => {
                if(e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },


    getContact: (userId) => {
        return new Promise ((resolve, reject) => {
            const query = `SELECT u.uid, u.image, u.name, ut.token, u.is_online, u.last_active 
            FROM users u
            LEFT JOIN user_tokens ut ON ut.user_id = u.uid
            WHERE u.uid != ?`

            conn.query(query, [userId], (e, result) => {
                if(e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },


}