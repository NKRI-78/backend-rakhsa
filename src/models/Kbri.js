const conn = require('../configs/db')

module.exports = {

    userKbri: (userId) => {
        return new Promise((resolve, reject) => {
            var query = `SELECT c.name AS continent_name 
            FROM user_kbris uk
            INNER JOIN continents c ON uk.continent_id = c.id
            WHERE uk.user_id = ?`
            conn.query(query, [userId], (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

}