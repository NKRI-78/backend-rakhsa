const conn = require('../configs/db')

module.exports = {

    all: () => {
        return new Promise((resolve, reject) => {
            var query = `SELECT id, name FROM roles`
            conn.query(query, [roleId], (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    findById: (roleId) => {
        return new Promise((resolve, reject) => {
            var query = `SELECT id, name FROM roles WHERE id = ?`
            conn.query(query, [roleId], (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    insertUserRole: (userId, roleId) => {
        return new Promise((resolve, reject) => {
            var query = `INSERT user_roles (user_id, role_id) VALUES (?, ?)`
            conn.query(query, [userId, roleId], (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

}