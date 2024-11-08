const conn = require('../configs/db')
const connPPOB = require('../configs/db_ppob')

module.exports = {

    all: (offset, limit, type, userId) => {
        return new Promise((resolve, reject) => {

            var query = `SELECT i.uid, i.title, i.subject, i.description,
            i.link, i.isread, i.created_at, i.updated_at,
            i.type, p.fullname, u.email, i.latitude, i.longitude
            FROM inboxes i
            INNER JOIN users u ON u.uid = i.user_id 
            INNER JOIN profiles p ON p.user_id = u.uid
            WHERE i.user_id = '${userId}'
            AND i.type = '${type}'
            ORDER BY i.id DESC
            LIMIT ${offset}, ${limit}`

            if (type == "sos") {
                query = `SELECT i.uid, i.title, i.subject, i.description,
                i.link, i.isread, i.created_at, i.updated_at,
                i.type, p.fullname, u.email, i.latitude, i.longitude
                FROM inboxes i
                INNER JOIN users u ON u.uid = i.user_id 
                INNER JOIN profiles p ON p.user_id = u.uid
                WHERE i.user_id = '${userId}'
                AND i.type = 'sos'
                ORDER BY i.id DESC
                LIMIT ${offset}, ${limit}`
            }

            conn.query(query, (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    checkInboxes: (id) => {
        return new Promise((resolve, reject) => {
            var query = `SELECT title FROM inboxes WHERE uid = '${id}'`

            conn.query(query, (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    badgesNotReadAll: (userId) => {
        return new Promise((resolve, reject) => {
            var query = `SELECT title FROM inboxes WHERE isread = 0 AND user_id = '${userId}'`

            conn.query(query, (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    badgesNotRead: (userId, type) => {
        return new Promise((resolve, reject) => {
            var query = `SELECT title FROM inboxes WHERE isread = 0 AND user_id = '${userId}' AND type = '${type}'`

            conn.query(query, (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    updateInboxRead: (id) => {
        return new Promise((resolve, reject) => {
            var query = `UPDATE inboxes SET isread = '1' WHERE uid = '${id}'`

            conn.query(query, (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    createOrUpdate: (id, title, subject, description, link, userId, type, lat, lng) => {
        return new Promise((resolve, reject) => {
            var query = `INSERT INTO inboxes (uid, title, subject, description, link, user_id, type, latitude, longitude) 
            VALUES ('${id}', '${title}', '${subject}', '${description}', '${link}', '${userId}', '${type}', '${lat}', '${lng}')`

            conn.query(query, (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    createHistoryBroadcast: (title, message, data) => {
        return new Promise((resolve, reject) => {
            var query = `INSERT INTO broadcast_histories (title, message, data) VALUES ('${title}', '${message}', '${data}')`

            conn.query(query, (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    listInbox: () => {
        return new Promise((resolve, reject) => {
            var query = `
           SELECT * FROM broadcast_histories order by created_at DESC
            `

            conn.query(query, (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    createInboxPPOB: (title, description, field1, link, userId, origin) => {
        return new Promise((resolve, reject) => {
            var query = `INSERT INTO inboxes (title, description, field1, link, user_id, origin) 
            VALUES ('${title}', '${description}', '${field1}', '${link}', '${userId}', '${origin}')`

            connPPOB.query(query, (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    detail: (id) => {
        return new Promise((resolve, reject) => {
            var query = `SELECT i.uid, i.title, i.subject, i.latitude, i.longitude, i.description,
            i.link, i.isread, i.created_at, i.updated_at,
            i.type, p.fullname, u.email
            FROM inboxes i
            INNER JOIN users u ON u.uid = i.user_id 
            INNER JOIN profiles p ON p.user_id = u.uid
            WHERE i.uid = '${id}'
            ORDER BY i.id DESC`

            conn.query(query, (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    delete: (id) => {
        return new Promise((resolve, reject) => {
            var query = `DELETE FROM inboxes WHERE uid = '${id}'`

            conn.query(query, (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    updateInboxPPOB: (invoiceValue) => {
        return new Promise((resolve, reject) => {
            var query = `UPDATE inboxes SET is_read = 0, field2 = 'PAID' WHERE field3 = '${invoiceValue}'`

            connPPOB.query(query, (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

}