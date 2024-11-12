const conn = require('../configs/db')

module.exports = {

    list: () => {
        return new Promise((resolve, reject) => {
            var query = `SELECT s.uid, s.location, s.media, s.lat, s.lng, s.country, s.time, s.user_id, s.user_agent_id
                FROM sos s 
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

}