const conn = require('../configs/db')

module.exports = {

    list: (type, platformType) => {
        return new Promise((resolve, reject) => {
            var query = `SELECT s.uid, s.location, s.media, st.name AS type, s.lat, s.lng, s.country, s.is_finish, s.is_confirm, s.time, s.user_id, s.user_agent_id
                FROM sos s
                INNER JOIN sos_types st ON st.id = s.sos_type
                WHERE s.is_confirm = 1
                AND s.platform_type = '${platformType == 'raksha' ? 1 : 2}'
            `

            if(type == "waiting") {
                query = `SELECT s.uid, s.location, s.media, st.name AS type, s.lat, s.lng, s.country, s.is_finish, s.is_confirm, s.time, s.user_id, s.user_agent_id
                FROM sos s
                INNER JOIN sos_types st ON st.id = s.sos_type
                WHERE s.is_confirm = 0
                AND s.platform_type = '${platformType == 'raksha' ? 1 : 2}'`
            }

            if(type == "confirmed") {
                query = `SELECT s.uid, s.location, s.media, st.name AS type, s.lat, s.lng, s.country, s.is_finish, s.is_confirm, s.time, s.user_id, s.user_agent_id
                    FROM sos s
                    INNER JOIN sos_types st ON st.id = s.sos_type
                    WHERE s.is_confirm = 1 AND s.is_finish = 1
                    AND s.platform_type = '${platformType == 'raksha' ? 1 : 2}'
                `
            }

            if(type == "process") {
                query = `SELECT s.uid, s.location, s.media, st.name AS type, s.lat, s.lng, s.country, s.is_finish, s.is_confirm, s.time, s.user_id, s.user_agent_id
                FROM sos s
                INNER JOIN sos_types st ON st.id = s.sos_type
                WHERE s.is_confirm = 1 AND s.is_finish = 0
                AND s.platform_type = '${platformType == 'raksha' ? 1 : 2}'`
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

    rating: (id) => {
        return new Promise((resolve, reject) => {
            var query = `SELECT sr.rate, p.fullname 
            FROM sos_ratings sr 
            INNER JOIN profiles p ON p.user_id = sr.user_id 
            WHERE sr.sos_id = ?`
            conn.query(query, [id], (e, result) => {
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
            var query = `SELECT s.uid, s.location, s.media, st.name AS type, s.lat, s.lng, s.country, s.is_finish, s.is_confirm, s.time, s.user_id, s.user_agent_id
                FROM sos s 
                INNER JOIN sos_types st ON st.id = s.sos_type
                WHERE uid = ?
            `
            conn.query(query, [id], (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    checkSos: (sosId) => {
        return new Promise((resolve, reject) => {
            var query = `SELECT user_id, user_agent_id FROM sos WHERE uid = ?`
            conn.query(query, [sosId], (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    ratingSos: (sosId, rate, userId) => {
        return new Promise((resolve, reject) => {
            var query = `INSERT INTO sos_ratings (sos_id, rate, user_id) 
            VALUES (?, ?, ?)`
            conn.query(query, [sosId, rate, userId], (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    checkExpireSos: (sosId) => {
        return new Promise((resolve, reject) => {
            var query = `SELECT uid FROM sos WHERE uid = ? 
            AND is_finish = 1`
            conn.query(query, [sosId], (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    expireSos: (sosId) => {
        return new Promise((resolve, reject) => {
            var query = `UPDATE sos SET is_finish = 1
            WHERE uid = ?`
            conn.query(query, [sosId], (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

}