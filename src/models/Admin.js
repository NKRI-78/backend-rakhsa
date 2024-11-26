const conn = require('../configs/db')

module.exports = {

    assignUserKbri: (userId, continentId, stateId, cityId) => {
        return new Promise((resolve, reject) => {
            var query = `INSERT INTO user_kbris (user_id, continent_id, state_id, city_id) VALUES (?, ?, ?, ?)`
            conn.query(query, [userId, continentId, stateId, cityId], (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    confirmSos: (sosId, userId) => {
        return new Promise((resolve, reject) => {
            var query = `UPDATE sos SET is_confirm = 1, user_id = ?
            WHERE uid = ?`
            conn.query(query, [userId, sosId], (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

}