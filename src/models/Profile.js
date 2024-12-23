const conn = require('../configs/db')

module.exports = {

    updateAddress: (userId, lat, lng, address) => {
        return new Promise((resolve, reject) => {
            var query = `UPDATE profiles SET lat = ?, lng = ?, address = ? WHERE user_id = ?`
            conn.query(query, [lat, lng, address, userId], (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    updateProfileAvatar: (avatar, userId) => {
        return new Promise((resolve, reject) => {
            var query = `UPDATE profiles SET avatar = ? WHERE user_id = ?`
            conn.query(query, [avatar, userId], (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    initFcm: (token, userId) => {
        return new Promise((resolve, reject) => {
            var query = `INSERT INTO fcms (user_id, token) 
            VALUES (?, ?) 
            ON DUPLICATE KEY UPDATE 
            token = VALUES(token)`
            conn.query(query, [userId, token], (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    }

}