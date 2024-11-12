const conn = require('../configs/db')

module.exports = {

    login: (val) => {
        return new Promise((resolve, reject) => {
            var query = `SELECT u.uid, u.email, u.phone, u.password, u.enabled, p.fullname, r.name AS role
            FROM users u 
            INNER JOIN profiles p ON p.user_id = u.uid
            INNER JOIN user_roles ur ON ur.user_id = p.user_id
            INNER JOIN roles r ON r.id = ur.id
            WHERE email = ? OR username = ?`
            conn.query(query, [val, val], (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    registerMember: (userId, email, password) => {
        return new Promise((resolve, reject) => {
            var query = `INSERT INTO users (uid, email, password) VALUES (?, ?, ?)`
            conn.query(query, [userId, email, password], (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

}