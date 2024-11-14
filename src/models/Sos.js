const conn = require('../configs/db')

module.exports = {

    list: () => {
        return new Promise((resolve, reject) => {
            var query = `SELECT s.uid, s.location, s.media, st.name AS type, s.lat, s.lng, s.country, s.is_confirm, s.time, s.user_id, s.user_agent_id
            FROM sos s
            INNER JOIN sos_types st ON st.id = s.sos_type
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

    detail: (id) => {
        return new Promise((resolve, reject) => {
            var query = `SELECT s.uid, s.location, s.media, s.lat, s.lng, s.country, s.time, s.user_id, s.user_agent_id
                FROM sos s 
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

}