const conn = require('../configs/db')

module.exports = {
    createLogger: (userId, type, message, extra) => {
        return new Promise((resolve, reject) => {
            var data = {
                user_id: userId,
                type: type,
                message: message,
                extra: extra
            }

            var query = `
            INSERT INTO logs SET ?
            `

            conn.query(query, [data], (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },
}