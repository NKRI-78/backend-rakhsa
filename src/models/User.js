const conn = require('../configs/db')

module.exports = {

    getUser: (userId) => {
        return new Promise((resolve, reject) => {
            var query = `SELECT u.uid AS user_id, u.email, u.phone AS contact, p.emergency_contact, p.avatar, p.created_at, p.passport, p.address, p.fullname AS username
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

    listUser: () => {
        return new Promise((resolve, reject) => {
            var query = `SELECT u.uid AS user_id, p.fullname, COALESCE(p.avatar, '-') as avatar, COALESCE(p.address, '-') AS address, p.passport, 
                COALESCE(p.nik, '-') AS nik, p.avatar,
                COALESCE(p.emergency_contact, '-') AS emergency_contact, u.email, COALESCE(u.username, '-') AS username, 
                COALESCE(u.phone, '-') AS phone 
                FROM users u
                INNER JOIN profiles p 
                ON p.user_id = u.uid
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

    createUser: (userId, fullname, avatar, address, passport, nik, emergencyContact) => {
        return new Promise((resolve, reject) => {
            var query = `INSERT INTO profiles (user_id, fullname, avatar, address, passport, nik, emergency_contact) 
            VALUES (?, ?, ?, ?, ?, ?, ?)`
            conn.query(query, [userId, fullname, avatar, address, passport, nik, emergencyContact], (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },  

    registerAmulet: (userId, fullname, address) => {
        return new Promise((resolve, reject) => {
            var query = `INSERT INTO profiles (user_id, fullname, address) VALUES (?, ?, ?)`
            conn.query(query, [userId, fullname, address], (e, result) => {
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