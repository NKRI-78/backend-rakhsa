const conn = require('../configs/db')

module.exports = {

    getUser: (userId) => {
        return new Promise((resolve, reject) => {
            var query = `SELECT u.uid AS user_id, u.email, p.fullname AS username
                FROM users u
                INNER JOIN profiles p ON u.uid = p.user_id
                WHERE u.uid = ?
            `
            conn.query(query, [userId], (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    registerMember: (user_id, fullname, passport, emergency_contact) => {
        return new Promise((resolve, reject) => {
            var query = `INSERT INTO profiles (user_id, fullname, passport, emergency_contact) VALUES (?, ?, ?, ?)`
            conn.query(query, [user_id, fullname, passport, emergency_contact], (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

}