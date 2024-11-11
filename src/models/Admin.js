const conn = require('../configs/db')

module.exports = {

    confirmSos: (sosId) => {
        return new Promise((resolve, reject) => {
            var query = `UPDATE sos SET is_confirm = 1 
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