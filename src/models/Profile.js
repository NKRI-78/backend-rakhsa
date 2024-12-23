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
            var query = `UPDATE fcms SET token = ? WHERE user_id = ?`
            conn.query(query, [token, userId], (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    }

}