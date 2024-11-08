const conn = require('../configs/db')

module.exports = {

    callback: (userId, amount) => {
        return new Promise ((resolve, reject) => {
            var query = `INSERT INTO member_payments (user_id, amount) 
            VALUES ('${userId}', '${amount}')`
            conn.query(query, (e, result) => {
                if(e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

}