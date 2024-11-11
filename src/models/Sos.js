const conn = require('../configs/db')

module.exports = {

    list: () => {
        return new Promise((resolve, reject) => {
            var query = `SELECT s.uid, s.location, s.country, s.time, s.user_id
                FROM sos s 
            `
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