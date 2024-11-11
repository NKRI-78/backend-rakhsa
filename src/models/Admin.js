const conn = require('../configs/db')

module.exports = {

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