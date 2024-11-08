const conn = require('../configs/db')

module.exports = {

    insert: (id, userId) => {
        return new Promise ((resolve, reject) => {
            var query = `INSERT INTO transactions (uid, user_id) VALUES ('${id}', '${userId}')`
            conn.query(query, (e, result) => {
                if(e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    delete: (id) => {
        return new Promise ((resolve, reject) => {
            var query = `DELETE FROM transactions WHERE uid = '${id}'`
            conn.query(query, (e, result) => {
                if(e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    }

}