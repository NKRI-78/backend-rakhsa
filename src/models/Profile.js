const conn = require('../configs/db')

module.exports = {

    updateAddress: (userId, address) => {
        return new Promise((resolve, reject) => {
            var query = `UPDATE profiles SET address = ? WHERE user_id = ?`
            conn.query(query, [address, userId], (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

}